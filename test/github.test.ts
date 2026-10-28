import { describe, expect, it, vi } from 'vitest';
import { MAX_BODY_BYTES, fetchRepo, mapLimit, readJson } from '../src/github.ts';

const TOKEN = 'ghs_secretvalue123';
const noSleep = async () => {};

function json(status: number, value: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

describe('fetchRepo', () => {
  it('sends the token only in the Authorization header and returns the body', async () => {
    const fetchImpl = vi.fn(async () => json(200, { full_name: 'a/b' }));
    const result = await fetchRepo('a/b', { token: TOKEN, fetchImpl, sleep: noSleep });
    expect(result).toEqual({ status: 200, body: { full_name: 'a/b' } });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.github.com/repos/a/b');
    expect(url).not.toContain(TOKEN);
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${TOKEN}`);
  });

  it('sends no Authorization header without a token', async () => {
    const fetchImpl = vi.fn(async () => json(200, {}));
    await fetchRepo('a/b', { fetchImpl, sleep: noSleep });
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.headers).not.toHaveProperty('Authorization');
  });

  it('encodes each path segment', async () => {
    const fetchImpl = vi.fn(async () => json(404, {}));
    await fetchRepo('a/b?x=1#y', { fetchImpl, sleep: noSleep });
    expect((fetchImpl.mock.calls[0] as unknown as [string])[0]).toBe(
      'https://api.github.com/repos/a/b%3Fx%3D1%23y',
    );
  });

  it('retries a server error a bounded number of times, then reports it', async () => {
    const fetchImpl = vi.fn(async () => json(502, {}));
    const sleep = vi.fn(noSleep);
    expect(await fetchRepo('a/b', { fetchImpl, sleep, retries: 2 })).toEqual({ status: 502 });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(sleep.mock.calls).toEqual([[1000], [2000]]);
  });

  it('clamps the retry count', async () => {
    const fetchImpl = vi.fn(async () => json(503, {}));
    await fetchRepo('a/b', { fetchImpl, sleep: noSleep, retries: 1_000_000 });
    expect(fetchImpl).toHaveBeenCalledTimes(6);
  });

  it('recovers when a retry succeeds', async () => {
    const fetchImpl = vi
      .fn<() => Promise<Response>>()
      .mockResolvedValueOnce(json(429, {}))
      .mockResolvedValueOnce(json(200, { full_name: 'a/b' }));
    expect(await fetchRepo('a/b', { fetchImpl, sleep: noSleep })).toEqual({
      status: 200,
      body: { full_name: 'a/b' },
    });
  });

  it('stops on an exhausted rate limit with a message that has no token in it', async () => {
    const fetchImpl = vi.fn(async () => json(403, {}, { 'x-ratelimit-remaining': '0' }));
    const failure = fetchRepo('a/b', { token: TOKEN, fetchImpl, sleep: noSleep });
    await expect(failure).rejects.toThrow('GitHub API rate limit reached');
    await failure.catch((error: Error) => expect(error.message).not.toContain(TOKEN));
  });

  it('returns other failures as a status for the classifier', async () => {
    const fetchImpl = vi.fn(async () => json(404, { message: 'Not Found' }));
    expect(await fetchRepo('a/b', { fetchImpl, sleep: noSleep })).toEqual({ status: 404 });
  });
});

describe('readJson', () => {
  it('refuses a body whose declared size is over the limit', async () => {
    const response = new Response('{}', {
      headers: { 'content-length': String(MAX_BODY_BYTES + 1) },
    });
    await expect(readJson(response)).rejects.toThrow(/larger than/);
  });

  it('refuses a streamed body that grows past the limit without a declared size', async () => {
    const chunk = new Uint8Array(64 * 1024).fill(0x20);
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        sent += chunk.byteLength;
        controller.enqueue(chunk);
        if (sent > MAX_BODY_BYTES * 4) controller.close();
      },
    });
    await expect(readJson(new Response(stream))).rejects.toThrow(/larger than/);
    expect(sent).toBeLessThan(MAX_BODY_BYTES * 2);
  });

  it('parses a normal body and returns null for an empty one', async () => {
    expect(await readJson(new Response('{"a":1}'))).toEqual({ a: 1 });
    expect(await readJson(new Response(null))).toBeNull();
  });
});

describe('mapLimit', () => {
  it('keeps the input order and never runs more than the limit at once', async () => {
    let running = 0;
    let peak = 0;
    const result = await mapLimit([5, 1, 4, 2, 3], 2, async (n) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((resolve) => setTimeout(resolve, n));
      running--;
      return n * 10;
    });
    expect(result).toEqual([50, 10, 40, 20, 30]);
    expect(peak).toBe(2);
  });

  it('treats a non-numeric or out-of-range limit as a safe width', async () => {
    for (const limit of [0, -3, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(await mapLimit([1, 2, 3], limit, async (n) => n)).toEqual([1, 2, 3]);
    }
    expect(await mapLimit([], 4, async (n: number) => n)).toEqual([]);
  });
});
