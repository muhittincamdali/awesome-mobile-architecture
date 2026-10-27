import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LIMITS, isCalendarDate, normalizeUrl, validateEntries } from '../src/entries.ts';

const TODAY = '2026-10-28';

const valid = {
  name: 'Bloc',
  url: 'https://github.com/felangel/bloc',
  repo: 'felangel/bloc',
  platform: 'flutter',
  category: 'state',
  why: 'Events in, states out: business logic kept out of widgets.',
  verified: '2026-10-28',
};

function errorsFor(entry: Record<string, unknown>): string[] {
  return validateEntries({ entries: [entry] }, TODAY).errors;
}

describe('validateEntries', () => {
  it('accepts the committed list', () => {
    const data: unknown = JSON.parse(readFileSync('data/entries.json', 'utf8'));
    const { entries, errors } = validateEntries(data, TODAY);
    expect(errors).toEqual([]);
    expect(entries.length).toBeGreaterThan(0);
    for (const platform of ['ios', 'flutter', 'react-native']) {
      expect(entries.some((e) => e.platform === platform)).toBe(true);
    }
  });

  it('accepts a complete entry and keeps its fields', () => {
    const { entries, errors } = validateEntries({ entries: [valid] }, TODAY);
    expect(errors).toEqual([]);
    expect(entries).toEqual([valid]);
  });

  it('rejects input that is not an object with an entries array', () => {
    for (const data of [null, [], 'x', 42, {}, { entries: {} }]) {
      expect(validateEntries(data, TODAY).errors).toEqual([
        'the file must be an object with an "entries" array',
      ]);
    }
  });

  it('rejects a list longer than the limit without walking it', () => {
    const entries = new Array(LIMITS.maxEntries + 1).fill(valid);
    expect(validateEntries({ entries }, TODAY).errors).toEqual([
      `more than ${LIMITS.maxEntries} entries`,
    ]);
  });

  it('caps the number of reported errors', () => {
    const entries = new Array(LIMITS.maxEntries).fill({});
    const { errors } = validateEntries({ entries }, TODAY);
    expect(errors).toHaveLength(LIMITS.maxErrors);
  });

  it('reports unknown keys at both levels', () => {
    expect(validateEntries({ entries: [valid], extra: 1 }, TODAY).errors).toEqual([
      'unknown top-level key(s): extra',
    ]);
    expect(errorsFor({ ...valid, stars: 9000 })).toEqual(['entries[0]: unknown key "stars"']);
  });

  it('requires every field to be a trimmed, non-empty string', () => {
    expect(errorsFor({ ...valid, name: '' })).toContain(
      'entries[0].name: must be a non-empty string',
    );
    expect(errorsFor({ ...valid, why: 3 })).toContain('entries[0].why: must be a non-empty string');
    expect(errorsFor({ ...valid, name: ' Bloc' })).toContain(
      'entries[0].name: has leading or trailing spaces',
    );
  });

  it('keeps the why line to one line of plain text', () => {
    expect(errorsFor({ ...valid, why: 'Events in.\nStates out, from widgets.' })).toContain(
      'entries[0].why: must be a single line',
    );
    expect(errorsFor({ ...valid, why: 'Events in, states out\u2028from widgets.' })).toContain(
      'entries[0].why: must be a single line',
    );
    expect(errorsFor({ ...valid, why: 'Too short.' })[0]).toMatch(/must be 20-160 characters/);
    expect(errorsFor({ ...valid, why: `A${'b'.repeat(200)}.` })[0]).toMatch(/is 202/);
    expect(errorsFor({ ...valid, why: 'events in, states out from widgets.' })).toContain(
      'entries[0].why: must start with a capital letter or code',
    );
    expect(errorsFor({ ...valid, why: 'Events in, states out from widgets' })).toContain(
      'entries[0].why: must end with a full stop',
    );
  });

  it('rejects Markdown or HTML that would change the rendered README', () => {
    expect(errorsFor({ ...valid, why: 'See [this](https://evil.test) for more.' })).toContain(
      'entries[0].why: contains Markdown link or HTML syntax',
    );
    expect(errorsFor({ ...valid, why: 'Events <img src=x onerror=alert(1)> here.' })).toContain(
      'entries[0].why: contains Markdown link or HTML syntax',
    );
    expect(errorsFor({ ...valid, why: 'Uses `@Observable for the model state.' })).toContain(
      'entries[0].why: has an unclosed code span',
    );
    expect(errorsFor({ ...valid, name: 'Bloc](https://evil.test)' })).toContain(
      'entries[0].name: contains Markdown or HTML syntax',
    );
  });

  it('rejects text in the why line that GitHub would turn into a link', () => {
    const message = 'entries[0].why: contains a link or e-mail address; the link belongs in url';
    for (const why of [
      'Mirrors the docs at www.gіthub.com for offline use.',
      'Mirrors the docs at WWW.example.org for offline use.',
      'A local copy is served on http://192.168.0.1 here.',
      'Read the long version at https://xn--gthub-n4a.com today.',
      'Older notes live on ftp://example.org in a zip.',
      'Ask for access through mailto:team@example.org first.',
      'Ask the authors at team@example.org for the slides.',
    ]) {
      expect(errorsFor({ ...valid, why })).toContain(message);
    }
    expect(errorsFor({ ...valid, why: 'Uses `@Observable` models owned with `@State`.' })).toEqual(
      [],
    );
  });

  it('rejects invisible and text-direction characters that hide what a reviewer reads', () => {
    const hiddenCharacters = [
      ...['\u200b', '\u202e', '\u2066', '\ufeff', '\u00ad'],
      // tag characters, assigned and unassigned
      ...['\u{e0000}', '\u{e0001}', '\u{e0041}', '\u{e007f}'],
      // variation selectors
      ...['\ufe00', '\ufe0f', '\u{e0100}'],
      // fillers and joiners that render as nothing or a blank
      ...['\u3164', '\u034f', '\u17b4', '\u17b5', '\u115f', '\u1160', '\uffa0', '\u180b', '\u2800'],
    ];
    for (const hidden of hiddenCharacters) {
      expect(errorsFor({ ...valid, name: `Bl${hidden}oc` })).toContain(
        'entries[0].name: contains an invisible or text-direction character',
      );
      expect(
        errorsFor({ ...valid, why: `Events in, states out${hidden} from widgets.` }),
      ).toContain('entries[0].why: contains an invisible or text-direction character');
    }
    expect(errorsFor({ ...valid, name: 'Bloc für Flutter – Çekirdek' })).toEqual([]);
  });

  it('refuses look-alike hosts written with non-ASCII letters', () => {
    const { repo: _repo, ...entry } = valid;
    expect(
      errorsFor({ ...entry, url: 'https://g\u0456thub.com/felangel/bloc' }).join('\n'),
    ).toContain('uses an internationalised host name');
    expect(errorsFor({ ...entry, url: 'https://xn--bcher-kva.example/' }).join('\n')).toContain(
      'uses an internationalised host name',
    );
  });

  it('treats a __proto__ key as an unknown key instead of a prototype change', () => {
    const entry = JSON.parse(`{"__proto__": {"polluted": true}, ${JSON.stringify(valid).slice(1)}`);
    expect(errorsFor(entry)).toEqual(['entries[0]: unknown key "__proto__"']);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('turns marketing words into an error that asks for a reason', () => {
    expect(errorsFor({ ...valid, why: 'The best state library for Flutter apps.' })[0]).toMatch(
      /"best" is a claim/,
    );
    expect(errorsFor({ ...valid, why: 'A blazing fast store for Flutter apps.' })[0]).toMatch(
      /"blazing" is a claim/,
    );
  });

  it('accepts only known platforms and categories', () => {
    expect(errorsFor({ ...valid, platform: 'android' })[0]).toMatch(
      /platform: "android" is not one/,
    );
    expect(errorsFor({ ...valid, category: 'misc' })[0]).toMatch(/category: "misc" is not one/);
  });

  it('accepts only public https links without credentials', () => {
    const cases: Array<[string, string]> = [
      ['http://github.com/felangel/bloc', 'must use https'],
      ['https://user:pass@example.org/a', 'must not contain credentials'],
      ['https://127.0.0.1/a', 'must use a public host name'],
      ['https://localhost/a', 'must use a public host name'],
      ['https://[::1]/a', 'must use a public host name'],
      ['not a url', 'contains whitespace'],
      ['notaurl', '"notaurl" is not a URL'],
      [`https://example.org/${'a'.repeat(400)}`, 'longer than 300 characters'],
      ['https://example.org/a_(b)', 'contains characters that break a Markdown link'],
    ];
    for (const [url, message] of cases) {
      const { repo: _repo, ...entry } = valid;
      expect(errorsFor({ ...entry, url }).join('\n')).toContain(message);
    }
  });

  it('ties a GitHub link to its repo field', () => {
    const { repo: _repo, ...withoutRepo } = valid;
    expect(errorsFor(withoutRepo)).toContain(
      'entries[0].repo: required for a GitHub link ("felangel/bloc")',
    );
    expect(errorsFor({ ...valid, repo: 'other/bloc' })).toContain(
      'entries[0].repo: "other/bloc" does not match the link ("felangel/bloc")',
    );
    expect(errorsFor({ ...valid, repo: 'FELANGEL/Bloc' })).toEqual([]);
    expect(errorsFor({ ...valid, url: 'https://github.com/felangel' })).toContain(
      'entries[0].url: a GitHub link must point into a repository',
    );
  });

  it('rejects repo values that are not a plain owner/name pair', () => {
    for (const repo of [
      'felangel',
      'a/b/c',
      '../etc',
      'felangel/..',
      'felangel/.',
      '-x/y',
      'a b/c',
    ]) {
      expect(
        errorsFor({ ...valid, url: 'https://pub.dev/packages/bloc', repo }).join('\n'),
      ).toContain('is not an owner/name pair');
    }
  });

  it('checks the verified date', () => {
    expect(errorsFor({ ...valid, verified: '2026-02-30' })).toContain(
      'entries[0].verified: "2026-02-30" is not a YYYY-MM-DD date',
    );
    expect(errorsFor({ ...valid, verified: '28.10.2026' })[0]).toMatch(/not a YYYY-MM-DD date/);
    expect(errorsFor({ ...valid, verified: '2026-10-29' })).toContain(
      'entries[0].verified: 2026-10-29 is in the future',
    );
  });

  it('finds the same page listed twice, ignoring case, www and a trailing slash', () => {
    const copy = { ...valid, name: 'Bloc again', url: 'https://www.GitHub.com/felangel/bloc/' };
    expect(validateEntries({ entries: [valid, copy] }, TODAY).errors).toEqual([
      'entries[1].url: duplicate of entries[0]',
    ]);
  });

  it('finds a name used twice on one platform but allows it on another', () => {
    const second = { ...valid, url: 'https://pub.dev/packages/bloc', repo: 'felangel/bloc' };
    expect(validateEntries({ entries: [valid, second] }, TODAY).errors).toEqual([
      'entries[1].name: "Bloc" already used by entries[0]',
    ]);
    const elsewhere = { ...second, platform: 'react-native' };
    expect(validateEntries({ entries: [valid, elsewhere] }, TODAY).errors).toEqual([]);
  });

  it('drops invalid entries from the result', () => {
    const { entries } = validateEntries({ entries: [valid, { ...valid, url: 'x' }] }, TODAY);
    expect(entries).toHaveLength(1);
  });
});

describe('isCalendarDate', () => {
  it('accepts real dates, including 29 February in a leap year', () => {
    expect(isCalendarDate('2028-02-29')).toBe(true);
    expect(isCalendarDate('2026-12-31')).toBe(true);
  });

  it('rejects impossible or malformed dates', () => {
    for (const value of [
      '2026-02-29',
      '2026-13-01',
      '2026-00-10',
      '2026-1-01',
      '',
      '2026-10-28T00',
    ]) {
      expect(isCalendarDate(value)).toBe(false);
    }
  });
});

describe('normalizeUrl', () => {
  it('keeps query strings, which can name different pages', () => {
    expect(normalizeUrl('https://a.dev/x?p=1')).not.toBe(normalizeUrl('https://a.dev/x?p=2'));
  });
});
