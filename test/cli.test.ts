import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { latestCalendarDate, main } from '../src/cli.ts';
import { LIMITS } from '../src/entries.ts';
import { LIST_END, LIST_START } from '../src/render.ts';

const NOW = new Date('2026-10-28T12:00:00Z');
const entry = {
  name: 'Bloc',
  url: 'https://github.com/felangel/bloc',
  repo: 'felangel/bloc',
  platform: 'flutter',
  category: 'state',
  why: 'Events in, states out: business logic kept out of widgets.',
  verified: '2026-10-20',
};

let root: string;
let errors: string[];
let logs: string[];

function writeRepo(entries: unknown, readme = `# List\n\n${LIST_START}\n${LIST_END}\n`): void {
  mkdirSync(join(root, 'data'), { recursive: true });
  writeFileSync(join(root, 'data', 'entries.json'), JSON.stringify(entries));
  writeFileSync(join(root, 'README.md'), readme);
}

const run = (...args: string[]) => main([...args, '--root', root], NOW);

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'list-cli-'));
  errors = [];
  logs = [];
  vi.spyOn(console, 'error').mockImplementation((message: string) => void errors.push(message));
  vi.spyOn(console, 'log').mockImplementation((message: string) => void logs.push(message));
  vi.stubEnv('GITHUB_STEP_SUMMARY', '');
  vi.stubEnv('GITHUB_TOKEN', '');
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('check and render', () => {
  it('fails while the README is out of date and passes after render', async () => {
    writeRepo({ entries: [entry] });
    expect(await run('check')).toBe(1);
    expect(errors.join('\n')).toContain('npm run list:render');

    expect(await run('render')).toBe(0);
    expect(readFileSync(join(root, 'README.md'), 'utf8')).toContain(
      '- [Bloc](https://github.com/felangel/bloc)',
    );
    expect(await run('check')).toBe(0);
    expect(logs.at(-1)).toBe('OK: 1 entries, README.md is up to date.');
  });

  it('leaves README.md untouched on a second render', async () => {
    writeRepo({ entries: [entry] });
    await run('render');
    await run('render');
    expect(logs.at(-1)).toBe('Unchanged: README.md (1 entries).');
  });

  it('reports every schema error and exits 1', async () => {
    writeRepo({
      entries: [
        { ...entry, why: 'short' },
        { ...entry, platform: 'web' },
      ],
    });
    expect(await run('check')).toBe(1);
    expect(errors.some((e) => e.includes('entries[0].why'))).toBe(true);
    expect(errors.some((e) => e.includes('entries[1].platform'))).toBe(true);
  });

  it('rejects broken JSON and an oversized file before parsing it', async () => {
    writeRepo({ entries: [] });
    writeFileSync(join(root, 'data', 'entries.json'), '{"entries": [');
    expect(await run('check')).toBe(1);
    expect(errors[0]).toMatch(/not valid JSON/);

    writeFileSync(join(root, 'data', 'entries.json'), ' '.repeat(LIMITS.maxFileBytes + 1));
    expect(await run('check')).toBe(1);
    expect(errors.at(-1)).toMatch(/the limit is/);
  });

  it('fails on a README without list markers instead of guessing', async () => {
    writeRepo({ entries: [entry] }, '# No markers\n');
    await expect(run('render')).rejects.toThrow(/expected one/);
  });

  it('prints usage for unknown commands and options', async () => {
    writeRepo({ entries: [entry] });
    expect(await run('publish')).toBe(2);
    expect(await main([])).toBe(2);
    await expect(main(['check', '--bogus'])).rejects.toThrow(/Unknown option/);
  });
});

describe('staleness', () => {
  it('asks GitHub once per repository and passes when all are healthy', async () => {
    writeRepo({
      entries: [
        entry,
        {
          ...entry,
          name: 'Bloc examples',
          url: 'https://github.com/felangel/bloc/tree/master/examples',
        },
      ],
    });
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            full_name: 'felangel/bloc',
            archived: false,
            pushed_at: '2026-10-25T00:00:00Z',
          }),
        ),
    );
    vi.stubGlobal('fetch', fetchMock);
    expect(await run('staleness')).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('fails, writes the job summary and the JSON file when a repository is archived', async () => {
    writeRepo({ entries: [entry] });
    const summary = join(root, 'summary.md');
    vi.stubEnv('GITHUB_STEP_SUMMARY', summary);
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            full_name: 'felangel/bloc',
            archived: true,
            pushed_at: '2026-10-25T00:00:00Z',
          }),
        ),
    );
    const out = join(root, 'out.json');
    expect(await run('staleness', '--json', out)).toBe(1);
    expect(readFileSync(summary, 'utf8')).toContain('| felangel/bloc | archived by its owner |');
    expect(JSON.parse(readFileSync(out, 'utf8')).statuses[0].state).toBe('archived');
  });

  it('records a network failure as an error for that repository', async () => {
    writeRepo({ entries: [entry] });
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('fetch failed');
    });
    expect(await run('staleness')).toBe(1);
    expect(logs.join('\n')).toContain('| felangel/bloc | fetch failed |');
  });

  it('rejects a malformed day count', async () => {
    writeRepo({ entries: [entry] });
    await expect(run('staleness', '--max-age-days', '1e9')).rejects.toThrow(RangeError);
  });
});

describe('latestCalendarDate', () => {
  it('accepts the date of the earliest time zone, so a check made today never counts as future', () => {
    expect(latestCalendarDate(new Date('2026-10-27T22:00:00Z'))).toBe('2026-10-28');
    expect(latestCalendarDate(new Date('2026-10-27T09:59:59Z'))).toBe('2026-10-27');
  });
});
