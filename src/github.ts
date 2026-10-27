// Minimal GitHub REST client for the staleness check. The token is only ever placed in the
// Authorization header; no message built here contains it.

import type { RepoResponse } from './staleness.ts';

export const MAX_BODY_BYTES = 512 * 1024;
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);

export interface FetchRepoOptions {
  token?: string | undefined;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  retries?: number;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchRepo(
  repo: string,
  options: FetchRepoOptions = {},
): Promise<RepoResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const retries = Math.min(Math.max(options.retries ?? 2, 0), 5);
  const sleep = options.sleep ?? defaultSleep;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'awesome-mobile-architecture-staleness',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  for (let attempt = 0; ; attempt++) {
    const response = await fetchImpl(
      `https://api.github.com/repos/${repo.split('/').map(encodeURIComponent).join('/')}`,
      {
        headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(options.timeoutMs ?? 20_000),
      },
    );
    if (RETRY_STATUSES.has(response.status) && attempt < retries) {
      await response.body?.cancel();
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      await response.body?.cancel();
      throw new Error('GitHub API rate limit reached; set GITHUB_TOKEN to raise it');
    }
    if (!response.ok) {
      await response.body?.cancel();
      return { status: response.status };
    }
    return { status: response.status, body: await readJson(response) };
  }
}

/** Parses a JSON body, refusing one larger than MAX_BODY_BYTES instead of buffering it. */
export async function readJson(response: Response): Promise<unknown> {
  const declared = Number(response.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    await response.body?.cancel();
    throw new Error(`response larger than ${MAX_BODY_BYTES} bytes`);
  }
  if (!response.body) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error(`response larger than ${MAX_BODY_BYTES} bytes`);
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

/** Runs `task` over `items` with at most `limit` in flight, keeping the input order in the result. */
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const width = Math.min(Math.max(Math.trunc(limit) || 1, 1), 16, Math.max(items.length, 1));
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index] as T);
    }
  };
  await Promise.all(Array.from({ length: width }, worker));
  return results;
}
