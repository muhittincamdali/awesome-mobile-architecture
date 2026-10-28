// Decides whether a listed repository is still a fair recommendation, from GitHub's answer.

export const DAY_MS = 86_400_000;
export const DEFAULT_MAX_AGE_DAYS = 540;
export const DEFAULT_REVERIFY_DAYS = 365;
const MAX_DAYS = 3650;

export type RepoStatus =
  | { repo: string; state: 'ok'; daysSincePush: number }
  | { repo: string; state: 'stale'; daysSincePush: number }
  | { repo: string; state: 'archived' }
  | { repo: string; state: 'disabled' }
  | { repo: string; state: 'missing' }
  | { repo: string; state: 'moved'; movedTo: string }
  | { repo: string; state: 'error'; detail: string };

/** What the GitHub client hands over: the HTTP status and, for a 2xx answer, the parsed body. */
export interface RepoResponse {
  status: number;
  body?: unknown;
}

/** Parses a day count given on the command line; only whole days from 1 to 3650 are accepted. */
export function parseDays(value: string, option: string): number {
  if (!/^\d{1,4}$/.test(value)) throw new RangeError(`${option} must be a whole number of days`);
  return checkDays(Number(value), option);
}

export function checkDays(days: number, option: string): number {
  if (!Number.isSafeInteger(days) || days < 1 || days > MAX_DAYS) {
    throw new RangeError(`${option} must be between 1 and ${MAX_DAYS} days`);
  }
  return days;
}

export function classifyRepo(
  repo: string,
  response: RepoResponse,
  now: Date,
  maxAgeDays: number,
): RepoStatus {
  checkDays(maxAgeDays, 'maxAgeDays');
  if (response.status === 404 || response.status === 451) return { repo, state: 'missing' };
  if (response.status < 200 || response.status > 299) {
    return {
      repo,
      state: 'error',
      detail: `GitHub answered HTTP ${response.status}`,
    };
  }

  const body = response.body;
  if (typeof body !== 'object' || body === null) {
    return {
      repo,
      state: 'error',
      detail: 'GitHub answered without a repository object',
    };
  }
  const {
    full_name: fullName,
    archived,
    disabled,
    pushed_at: pushedAt,
  } = body as Record<string, unknown>;
  if (
    typeof fullName !== 'string' ||
    typeof archived !== 'boolean' ||
    typeof pushedAt !== 'string'
  ) {
    return {
      repo,
      state: 'error',
      detail: 'the repository object lacks full_name, archived or pushed_at',
    };
  }

  if (fullName.toLowerCase() !== repo.toLowerCase())
    return { repo, state: 'moved', movedTo: fullName };
  if (archived) return { repo, state: 'archived' };
  if (disabled === true) return { repo, state: 'disabled' };

  const daysSincePush = daysBetween(pushedAt, now);
  if (daysSincePush === undefined) {
    return {
      repo,
      state: 'error',
      detail: `pushed_at "${pushedAt.slice(0, 40)}" is not a date`,
    };
  }
  return daysSincePush > maxAgeDays
    ? { repo, state: 'stale', daysSincePush }
    : { repo, state: 'ok', daysSincePush };
}

/** Whole days from `isoDate` to `now`; a date in the future counts as 0, an invalid one as undefined. */
export function daysBetween(isoDate: string, now: Date): number | undefined {
  const time = Date.parse(isoDate);
  const reference = now.getTime();
  if (!Number.isFinite(time) || !Number.isFinite(reference)) return undefined;
  return Math.max(0, Math.floor((reference - time) / DAY_MS));
}

/** True when an entry's last manual check is more than `reverifyDays` old. */
export function needsReverification(verified: string, now: Date, reverifyDays: number): boolean {
  checkDays(reverifyDays, 'reverifyDays');
  const days = daysBetween(`${verified}T00:00:00Z`, now);
  return days === undefined || days > reverifyDays;
}
