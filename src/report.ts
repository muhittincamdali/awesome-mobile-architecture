// Markdown summary of a staleness run, written to the console and the GitHub job summary.

import type { RepoStatus } from './staleness.ts';

export interface ReverifyItem {
  name: string;
  verified: string;
}

export interface ReportSettings {
  maxAgeDays: number;
  reverifyDays: number;
}

const PROBLEM_TEXT = {
  stale: (s: Extract<RepoStatus, { state: 'stale' }>) => `no push for ${s.daysSincePush} days`,
  archived: () => 'archived by its owner',
  disabled: () => 'disabled by GitHub',
  missing: () => 'not found (deleted or private)',
  moved: (s: Extract<RepoStatus, { state: 'moved' }>) => `moved to ${s.movedTo}; update the link`,
  error: (s: Extract<RepoStatus, { state: 'error' }>) => s.detail,
};

export function hasProblems(
  statuses: readonly RepoStatus[],
  reverify: readonly ReverifyItem[],
): boolean {
  return reverify.length > 0 || statuses.some((s) => s.state !== 'ok');
}

export function formatReport(
  statuses: readonly RepoStatus[],
  reverify: readonly ReverifyItem[],
  settings: ReportSettings,
): string {
  const problems = statuses.filter((s) => s.state !== 'ok');
  const lines = [
    '## List staleness',
    '',
    `${statuses.length} repositories checked, ${problems.length} need attention ` +
      `(stale after ${settings.maxAgeDays} days without a push).`,
  ];
  if (problems.length > 0) {
    lines.push('', '| Repository | Problem |', '| --- | --- |');
    for (const status of problems) lines.push(`| ${status.repo} | ${describe(status)} |`);
  }
  if (reverify.length > 0) {
    lines.push(
      '',
      `${reverify.length} entries were last checked by hand more than ${settings.reverifyDays} days ago:`,
      '',
    );
    for (const item of reverify) lines.push(`- ${item.name} (${item.verified})`);
  }
  return lines.join('\n');
}

function describe(status: RepoStatus): string {
  switch (status.state) {
    case 'ok':
      return 'ok';
    case 'stale':
      return PROBLEM_TEXT.stale(status);
    case 'moved':
      return PROBLEM_TEXT.moved(status);
    case 'error':
      return PROBLEM_TEXT.error(status).replace(/[|\n\r]/g, ' ');
    default:
      return PROBLEM_TEXT[status.state]();
  }
}
