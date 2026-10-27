// Rules for the `url` field of an entry and the key that finds the same page listed twice.

import { CHARACTER_REFERENCE, CHARACTER_REFERENCE_ERROR } from './text-rules.ts';

export const MAX_URL_LENGTH = 300;

/** Checks one link and returns it parsed, or undefined when it cannot be parsed at all. */
export function checkUrl(
  value: string,
  where: string,
  fail: (message: string) => void,
): URL | undefined {
  if (value.length > MAX_URL_LENGTH) {
    fail(`${where}: longer than ${MAX_URL_LENGTH} characters`);
    return undefined;
  }
  if (/\s/.test(value)) {
    fail(`${where}: contains whitespace`);
    return undefined;
  }
  if (CHARACTER_REFERENCE.test(value)) fail(`${where}: ${CHARACTER_REFERENCE_ERROR}`);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    fail(`${where}: "${value}" is not a URL`);
    return undefined;
  }
  if (url.protocol !== 'https:') fail(`${where}: must use https`);
  if (url.username || url.password) fail(`${where}: must not contain credentials`);
  if (
    url.hostname === 'localhost' ||
    /^[\d.]+$/.test(url.hostname) ||
    url.hostname.startsWith('[')
  ) {
    fail(`${where}: must use a public host name`);
  }
  // `new URL` turns a Unicode host into punycode; such a host can imitate a known one
  // (a Cyrillic "а" in "github.com"), so it is refused rather than reviewed by eye.
  if (url.hostname.split('.').some((label) => label.startsWith('xn--'))) {
    fail(`${where}: uses an internationalised host name; link the ASCII host instead`);
  }
  // A backslash before the closing ")" would escape it and run the link into the reason.
  if (/[()<>\\]/.test(value)) fail(`${where}: contains characters that break a Markdown link`);
  return url;
}

/** Key used to find the same page listed twice. */
export function normalizeUrl(value: string): string {
  try {
    const url = new URL(value);
    const host = url.hostname
      .toLowerCase()
      .replace(/^www\./, '')
      .replace(/\.$/, '');
    const path = url.pathname.replace(/\/+$/, '').toLowerCase();
    return `${host}${path}${url.search}`;
  } catch {
    return value.toLowerCase();
  }
}
