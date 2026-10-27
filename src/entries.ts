// Schema and validation for data/entries.json, the single source of the list in README.md.
// The file arrives through pull requests, so every field is checked and every size is bounded.

import {
  CHARACTER_REFERENCE,
  CHARACTER_REFERENCE_ERROR,
  INVISIBLE,
  LINE_BREAKING,
} from './text-rules.ts';
import { MAX_URL_LENGTH, checkUrl, normalizeUrl } from './url-rules.ts';

export { normalizeUrl };

export const PLATFORMS = ['concepts', 'ios', 'flutter', 'react-native'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const CATEGORIES = [
  'guidance',
  'state',
  'dependency-injection',
  'navigation',
  'samples',
  'testing',
  'tooling',
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Entry {
  name: string;
  url: string;
  platform: Platform;
  category: Category;
  why: string;
  /** `owner/name` of the GitHub repository whose activity the staleness check reads. */
  repo?: string;
  /** Day a person last opened the link and confirmed the `why` line (YYYY-MM-DD). */
  verified: string;
}

export const LIMITS = {
  maxFileBytes: 1024 * 1024,
  maxEntries: 1000,
  maxErrors: 200,
  maxNameLength: 60,
  minWhyLength: 20,
  maxWhyLength: 160,
  maxUrlLength: MAX_URL_LENGTH,
} as const;

const ENTRY_KEYS = new Set(['name', 'url', 'platform', 'category', 'why', 'repo', 'verified']);
const REPO_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\/[A-Za-z0-9._-]{1,100}$/;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
// Characters that would change the Markdown or HTML around an entry when it is rendered. A
// backslash escapes the character after it, so a name ending in one would swallow the closing "]".
const NAME_FORBIDDEN = /[[\]<>`|*\\]/;
const WHY_FORBIDDEN = /[[\]<>|\\]/;
// GitHub turns a bare URL, a "www." host or an e-mail address into a link, which would skip the
// https, public-host and ASCII-host rules that `url` is held to.
const WHY_AUTOLINK = /[a-z][a-z0-9+.-]*:\/\/|www\.|\b(?:mailto|xmpp):|[\w.+-]@[\w-]+\./i;
const HYPE_WORDS =
  /\b(?:best|awesome|ultimate|world[- ]class|blazing(?:ly)?|revolutionary|must[- ]have|gold standard|game[- ]changer|enterprise[- ]grade|#1)\b/i;

export interface ValidationResult {
  entries: Entry[];
  errors: string[];
}

/** Checks parsed JSON against the schema. `today` is the latest date a `verified` field may hold. */
export function validateEntries(data: unknown, today: string): ValidationResult {
  const errors: string[] = [];
  const report = (message: string): void => {
    if (errors.length < LIMITS.maxErrors) errors.push(message);
  };

  if (!isPlainObject(data) || !Array.isArray(data.entries)) {
    return { entries: [], errors: ['the file must be an object with an "entries" array'] };
  }
  const extraKeys = Object.keys(data).filter((key) => key !== 'entries');
  if (extraKeys.length > 0) report(`unknown top-level key(s): ${extraKeys.join(', ')}`);
  if (data.entries.length > LIMITS.maxEntries) {
    return { entries: [], errors: [`more than ${LIMITS.maxEntries} entries`] };
  }

  const entries: Entry[] = [];
  const seenUrls = new Map<string, number>();
  const seenNames = new Map<string, number>();

  data.entries.forEach((raw: unknown, index: number) => {
    const where = `entries[${index}]`;
    const entry = checkEntry(raw, where, today, report);
    if (!entry) return;

    const urlKey = normalizeUrl(entry.url);
    const firstUrl = seenUrls.get(urlKey);
    if (firstUrl === undefined) seenUrls.set(urlKey, index);
    else report(`${where}.url: duplicate of entries[${firstUrl}]`);

    const nameKey = `${entry.platform}:${comparableName(entry.name)}`;
    const firstName = seenNames.get(nameKey);
    if (firstName === undefined) seenNames.set(nameKey, index);
    else report(`${where}.name: "${entry.name}" already used by entries[${firstName}]`);

    entries.push(entry);
  });

  return { entries, errors };
}

function checkEntry(
  raw: unknown,
  where: string,
  today: string,
  report: (message: string) => void,
): Entry | undefined {
  if (!isPlainObject(raw)) {
    report(`${where}: must be an object`);
    return undefined;
  }
  const reported = new Set<string>();
  let valid = true;
  const fail = (message: string): void => {
    valid = false;
    if (!reported.has(message)) {
      reported.add(message);
      report(message);
    }
  };

  for (const key of Object.keys(raw)) {
    if (!ENTRY_KEYS.has(key)) fail(`${where}: unknown key "${key}"`);
  }

  const name = stringField(raw, 'name', where, fail);
  const url = stringField(raw, 'url', where, fail);
  const platform = stringField(raw, 'platform', where, fail);
  const category = stringField(raw, 'category', where, fail);
  const why = stringField(raw, 'why', where, fail);
  const verified = stringField(raw, 'verified', where, fail);
  const repo = raw.repo === undefined ? undefined : stringField(raw, 'repo', where, fail);

  if (name !== undefined) checkName(name, `${where}.name`, fail);
  if (why !== undefined) checkWhy(why, `${where}.why`, fail);
  if (platform !== undefined && !isOneOf(platform, PLATFORMS)) {
    fail(`${where}.platform: "${platform}" is not one of ${PLATFORMS.join(', ')}`);
  }
  if (category !== undefined && !isOneOf(category, CATEGORIES)) {
    fail(`${where}.category: "${category}" is not one of ${CATEGORIES.join(', ')}`);
  }
  if (verified !== undefined) checkDate(verified, today, `${where}.verified`, fail);

  const parsedUrl = url === undefined ? undefined : checkUrl(url, `${where}.url`, fail);
  if (repo !== undefined && (!REPO_PATTERN.test(repo) || /\/\.{1,2}$/.test(repo))) {
    fail(`${where}.repo: "${repo}" is not an owner/name pair`);
  }
  // "www.github.com" and "github.com." serve the same repositories, so they get the same repo rule.
  if (parsedUrl && parsedUrl.hostname.replace(/^www\./, '').replace(/\.$/, '') === 'github.com') {
    const [owner, project] = parsedUrl.pathname.split('/').filter(Boolean);
    const fromUrl = owner && project ? `${owner}/${project}` : undefined;
    if (!fromUrl) fail(`${where}.url: a GitHub link must point into a repository`);
    else if (repo === undefined) fail(`${where}.repo: required for a GitHub link ("${fromUrl}")`);
    else if (repo.toLowerCase() !== fromUrl.toLowerCase()) {
      fail(`${where}.repo: "${repo}" does not match the link ("${fromUrl}")`);
    }
  }

  if (!valid || !name || !url || !why || !verified) return undefined;
  if (!isOneOf(platform ?? '', PLATFORMS) || !isOneOf(category ?? '', CATEGORIES)) return undefined;
  const entry: Entry = {
    name,
    url,
    platform: platform as Platform,
    category: category as Category,
    why,
    verified,
  };
  if (repo !== undefined) entry.repo = repo;
  return entry;
}

function stringField(
  raw: Record<string, unknown>,
  key: string,
  where: string,
  fail: (message: string) => void,
): string | undefined {
  const value = raw[key];
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${where}.${key}: must be a non-empty string`);
    return undefined;
  }
  if (value !== value.trim()) {
    fail(`${where}.${key}: has leading or trailing spaces`);
    return undefined;
  }
  return value;
}

function checkName(name: string, where: string, fail: (message: string) => void): void {
  if (name.length > LIMITS.maxNameLength)
    fail(`${where}: longer than ${LIMITS.maxNameLength} characters`);
  if (LINE_BREAKING.test(name)) fail(`${where}: contains a line break or control character`);
  if (NAME_FORBIDDEN.test(name)) fail(`${where}: contains Markdown or HTML syntax`);
  if (INVISIBLE.test(name)) fail(`${where}: contains an invisible or text-direction character`);
  if (CHARACTER_REFERENCE.test(name)) fail(`${where}: ${CHARACTER_REFERENCE_ERROR}`);
}

function checkWhy(why: string, where: string, fail: (message: string) => void): void {
  if (LINE_BREAKING.test(why)) fail(`${where}: must be a single line`);
  if (why.length < LIMITS.minWhyLength || why.length > LIMITS.maxWhyLength) {
    fail(
      `${where}: must be ${LIMITS.minWhyLength}-${LIMITS.maxWhyLength} characters (is ${why.length})`,
    );
  }
  if (!/^[A-Z`@]/.test(why)) fail(`${where}: must start with a capital letter or code`);
  if (!why.endsWith('.')) fail(`${where}: must end with a full stop`);
  if (WHY_FORBIDDEN.test(why)) fail(`${where}: contains Markdown link or HTML syntax`);
  if (WHY_AUTOLINK.test(why)) {
    fail(`${where}: contains a link or e-mail address; the link belongs in url`);
  }
  if (INVISIBLE.test(why)) fail(`${where}: contains an invisible or text-direction character`);
  if (CHARACTER_REFERENCE.test(why)) fail(`${where}: ${CHARACTER_REFERENCE_ERROR}`);
  if ((why.match(/`/g) ?? []).length % 2 !== 0) fail(`${where}: has an unclosed code span`);
  const hype = HYPE_WORDS.exec(why);
  if (hype)
    fail(`${where}: "${hype[0]}" is a claim, not a reason; say what the link gives the reader`);
}

function checkDate(
  value: string,
  today: string,
  where: string,
  fail: (message: string) => void,
): void {
  if (!isCalendarDate(value)) {
    fail(`${where}: "${value}" is not a YYYY-MM-DD date`);
    return;
  }
  if (value > today) fail(`${where}: ${value} is in the future`);
}

/**
 * Key that makes names which read the same compare equal: NFKC turns a no-break or ideographic
 * space into a plain one and full-width letters into ASCII, then runs of spaces become one.
 */
function comparableName(name: string): string {
  return name.normalize('NFKC').replace(/\s+/g, ' ').toLowerCase();
}

/** True for a real date in YYYY-MM-DD form (rejects 2026-02-30 and 2026-13-01). */
export function isCalendarDate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number) as [number, number, number, number];
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOneOf<T extends string>(value: string, options: readonly T[]): value is T {
  return (options as readonly string[]).includes(value);
}
