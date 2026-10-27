// Command line for the list: `check` (offline, used by CI on every push), `render` (rewrites the
// README block) and `staleness` (asks GitHub about every listed repository, run weekly).

import { appendFileSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { LIMITS, validateEntries, type Entry } from './entries.ts';
import { fetchRepo, mapLimit } from './github.ts';
import { LIST_END, LIST_START, renderList } from './render.ts';
import { readBlock, replaceBlock } from './readme.ts';
import {
  DEFAULT_MAX_AGE_DAYS,
  DEFAULT_REVERIFY_DAYS,
  classifyRepo,
  needsReverification,
  parseDays,
  type RepoStatus,
} from './staleness.ts';
import { formatReport, hasProblems } from './report.ts';

const USAGE = `Usage: node src/cli.ts <command> [options]

Commands:
  check       Validate data/entries.json and confirm README.md shows the current list
  render      Rewrite the list block of README.md from data/entries.json
  staleness   Ask GitHub about every listed repository and flag stale, archived or moved ones

Options:
  --root <dir>            Repository folder (default: current folder)
  --max-age-days <n>      staleness: days without a push before a repository is stale (default ${DEFAULT_MAX_AGE_DAYS})
  --reverify-days <n>     staleness: days before an entry's manual check expires (default ${DEFAULT_REVERIFY_DAYS})
  --json <file>           staleness: also write the result as JSON`;

export async function main(argv: string[], now = new Date()): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      root: { type: 'string', default: '.' },
      'max-age-days': {
        type: 'string',
        default: String(DEFAULT_MAX_AGE_DAYS),
      },
      'reverify-days': {
        type: 'string',
        default: String(DEFAULT_REVERIFY_DAYS),
      },
      json: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  const [command, ...rest] = positionals;
  if (values.help || !command || rest.length > 0) {
    console.error(USAGE);
    return values.help ? 0 : 2;
  }

  const root = values.root;
  const entries = loadEntries(root, now);
  if (!entries) return 1;

  switch (command) {
    case 'check':
      return checkReadme(root, entries);
    case 'render':
      return renderReadme(root, entries);
    case 'staleness':
      return runStaleness(entries, now, {
        maxAgeDays: parseDays(values['max-age-days'], '--max-age-days'),
        reverifyDays: parseDays(values['reverify-days'], '--reverify-days'),
        jsonPath: values.json,
      });
    default:
      console.error(`Unknown command "${command}".\n\n${USAGE}`);
      return 2;
  }
}

function loadEntries(root: string, now: Date): Entry[] | undefined {
  const path = join(root, 'data', 'entries.json');
  const size = statSync(path).size;
  if (size > LIMITS.maxFileBytes) {
    console.error(`${path}: ${size} bytes, the limit is ${LIMITS.maxFileBytes}`);
    return undefined;
  }
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(`${path}: not valid JSON (${(error as Error).message})`);
    return undefined;
  }
  const { entries, errors } = validateEntries(data, latestCalendarDate(now));
  if (errors.length > 0) {
    for (const error of errors) console.error(`${path}: ${error}`);
    return undefined;
  }
  return entries;
}

/** The date already reached in the earliest time zone (UTC+14), so no contributor's today is "future". */
export function latestCalendarDate(now: Date): string {
  return new Date(now.getTime() + 14 * 3_600_000).toISOString().slice(0, 10);
}

function checkReadme(root: string, entries: Entry[]): number {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  if (readBlock(readme, LIST_START, LIST_END) !== renderList(entries)) {
    console.error(
      'README.md does not show the current list. Run `npm run list:render` and commit.',
    );
    return 1;
  }
  console.log(`OK: ${entries.length} entries, README.md is up to date.`);
  return 0;
}

function renderReadme(root: string, entries: Entry[]): number {
  const path = join(root, 'README.md');
  const readme = readFileSync(path, 'utf8');
  const updated = replaceBlock(readme, LIST_START, LIST_END, renderList(entries));
  if (updated !== readme) writeFileSync(path, updated);
  console.log(
    `${updated === readme ? 'Unchanged' : 'Updated'}: README.md (${entries.length} entries).`,
  );
  return 0;
}

interface StalenessOptions {
  maxAgeDays: number;
  reverifyDays: number;
  jsonPath: string | undefined;
}

async function runStaleness(
  entries: Entry[],
  now: Date,
  options: StalenessOptions,
): Promise<number> {
  const token = process.env.GITHUB_TOKEN || undefined;
  const repos = [...new Set(entries.flatMap((e) => (e.repo ? [e.repo] : [])))].sort();
  const statuses = await mapLimit(repos, 6, async (repo): Promise<RepoStatus> => {
    try {
      return classifyRepo(repo, await fetchRepo(repo, { token }), now, options.maxAgeDays);
    } catch (error) {
      return {
        repo,
        state: 'error',
        detail: (error as Error).message,
      };
    }
  });
  const reverify = entries
    .filter((e) => needsReverification(e.verified, now, options.reverifyDays))
    .map((e) => ({ name: e.name, verified: e.verified }));

  const report = formatReport(statuses, reverify, options);
  console.log(report);
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) appendFileSync(summaryPath, `${report}\n`);
  if (options.jsonPath) {
    writeFileSync(options.jsonPath, `${JSON.stringify({ statuses, reverify }, null, 2)}\n`);
  }
  return hasProblems(statuses, reverify) ? 1 : 0;
}

if (import.meta.main) {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (error: unknown) => {
      console.error((error as Error).message);
      process.exitCode = 2;
    },
  );
}
