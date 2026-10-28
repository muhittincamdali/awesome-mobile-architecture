import { describe, expect, it } from 'vitest';
import { formatReport, hasProblems } from '../src/report.ts';
import {
  checkDays,
  classifyRepo,
  daysBetween,
  needsReverification,
  parseDays,
} from '../src/staleness.ts';

const NOW = new Date('2026-10-28T12:00:00Z');
const body = (overrides: Record<string, unknown> = {}) => ({
  full_name: 'felangel/bloc',
  archived: false,
  disabled: false,
  pushed_at: '2026-10-25T08:00:00Z',
  ...overrides,
});

describe('classifyRepo', () => {
  it('passes a repository pushed recently', () => {
    expect(classifyRepo('felangel/bloc', { status: 200, body: body() }, NOW, 540)).toEqual({
      repo: 'felangel/bloc',
      state: 'ok',
      daysSincePush: 3,
    });
  });

  it('marks a repository stale one day after the limit, not on it', () => {
    const at = (date: string) =>
      classifyRepo('felangel/bloc', { status: 200, body: body({ pushed_at: date }) }, NOW, 30)
        .state;
    expect(at('2026-09-28T12:00:00Z')).toBe('ok');
    expect(at('2026-09-27T12:00:00Z')).toBe('stale');
  });

  it('reports archived, disabled and missing repositories', () => {
    const archived = { status: 200, body: body({ archived: true }) };
    expect(classifyRepo('felangel/bloc', archived, NOW, 540).state).toBe('archived');
    const disabled = { status: 200, body: body({ disabled: true }) };
    expect(classifyRepo('felangel/bloc', disabled, NOW, 540).state).toBe('disabled');
    expect(classifyRepo('felangel/bloc', { status: 404 }, NOW, 540).state).toBe('missing');
    expect(classifyRepo('felangel/bloc', { status: 451 }, NOW, 540).state).toBe('missing');
  });

  it('reports a renamed repository with its new name, ignoring letter case', () => {
    const moved = { status: 200, body: body({ full_name: 'QuickBirdEng/XCoordinator' }) };
    expect(classifyRepo('quickbirdstudios/XCoordinator', moved, NOW, 540)).toEqual({
      repo: 'quickbirdstudios/XCoordinator',
      state: 'moved',
      movedTo: 'QuickBirdEng/XCoordinator',
    });
    expect(classifyRepo('FELANGEL/BLOC', { status: 200, body: body() }, NOW, 540).state).toBe('ok');
  });

  it('turns unexpected answers into errors instead of passing them', () => {
    expect(classifyRepo('a/b', { status: 500 }, NOW, 540)).toEqual({
      repo: 'a/b',
      state: 'error',
      detail: 'GitHub answered HTTP 500',
    });
    expect(classifyRepo('a/b', { status: 200, body: null }, NOW, 540).state).toBe('error');
    expect(classifyRepo('a/b', { status: 200, body: 'text' }, NOW, 540).state).toBe('error');
    const noDate = { status: 200, body: body({ full_name: 'a/b', pushed_at: null }) };
    expect(classifyRepo('a/b', noDate, NOW, 540).state).toBe('error');
    const badDate = { status: 200, body: body({ full_name: 'a/b', pushed_at: 'yesterday' }) };
    expect(classifyRepo('a/b', badDate, NOW, 540)).toMatchObject({
      state: 'error',
      detail: 'pushed_at "yesterday" is not a date',
    });
  });

  it('refuses a limit that is not a whole number of days', () => {
    for (const days of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 3651]) {
      expect(() => classifyRepo('a/b', { status: 200, body: body() }, NOW, days)).toThrow(
        RangeError,
      );
    }
  });
});

describe('daysBetween', () => {
  it('counts whole days and treats a future date as today', () => {
    expect(daysBetween('2026-10-27T12:00:01Z', NOW)).toBe(0);
    expect(daysBetween('2026-10-27T12:00:00Z', NOW)).toBe(1);
    expect(daysBetween('2027-01-01T00:00:00Z', NOW)).toBe(0);
  });

  it('returns undefined for an invalid date or clock', () => {
    expect(daysBetween('not a date', NOW)).toBeUndefined();
    expect(daysBetween('2026-10-01', new Date(Number.NaN))).toBeUndefined();
  });
});

describe('parseDays', () => {
  it('accepts whole days from 1 to 3650', () => {
    expect(parseDays('1', '--x')).toBe(1);
    expect(parseDays('3650', '--x')).toBe(3650);
  });

  it('rejects anything else before it reaches a calculation', () => {
    for (const value of [
      '0',
      '3651',
      '-5',
      '1.5',
      '1e3',
      '',
      ' 7',
      '99999999999999999999',
      'NaN',
    ]) {
      expect(() => parseDays(value, '--max-age-days')).toThrow(RangeError);
    }
    expect(() => checkDays(Number.MAX_SAFE_INTEGER + 2, 'x')).toThrow(RangeError);
  });
});

describe('needsReverification', () => {
  it('expires a manual check after the given number of days', () => {
    expect(needsReverification('2025-10-28', NOW, 365)).toBe(false);
    expect(needsReverification('2025-10-27', NOW, 365)).toBe(true);
  });
});

describe('formatReport', () => {
  const settings = { maxAgeDays: 540, reverifyDays: 365 };

  it('summarises a clean run in one sentence', () => {
    const statuses = [{ repo: 'a/b', state: 'ok' as const, daysSincePush: 1 }];
    expect(hasProblems(statuses, [])).toBe(false);
    expect(formatReport(statuses, [], settings)).toBe(
      '## List staleness\n\n1 repositories checked, 0 need attention (stale after 540 days without a push).',
    );
  });

  it('lists every problem and every expired manual check', () => {
    const statuses = [
      { repo: 'a/ok', state: 'ok' as const, daysSincePush: 1 },
      { repo: 'a/old', state: 'stale' as const, daysSincePush: 700 },
      { repo: 'a/gone', state: 'missing' as const },
      { repo: 'a/moved', state: 'moved' as const, movedTo: 'b/moved' },
      { repo: 'a/err', state: 'error' as const, detail: 'bad | value\nhere' },
    ];
    const reverify = [{ name: 'Old article', verified: '2024-01-01' }];
    const report = formatReport(statuses, reverify, settings);
    expect(hasProblems(statuses, reverify)).toBe(true);
    expect(report).toContain('| a/old | no push for 700 days |');
    expect(report).toContain('| a/gone | not found (deleted or private) |');
    expect(report).toContain('| a/moved | moved to b/moved; update the link |');
    expect(report).toContain('| a/err | bad   value here |');
    expect(report).not.toContain('a/ok');
    expect(report).toContain('- Old article (2024-01-01)');
  });

  it('counts an expired manual check as a problem on its own', () => {
    expect(hasProblems([], [{ name: 'x', verified: '2020-01-01' }])).toBe(true);
  });
});
