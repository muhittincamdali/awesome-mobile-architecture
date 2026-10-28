// Turns validated entries into the Markdown block between the list markers in README.md.

import { CATEGORIES, PLATFORMS, type Category, type Entry, type Platform } from './entries.ts';

export const LIST_START = '<!-- list:start -->';
export const LIST_END = '<!-- list:end -->';

export const PLATFORM_TITLES: Record<Platform, string> = {
  concepts: 'Concepts that apply everywhere',
  ios: 'iOS',
  flutter: 'Flutter',
  'react-native': 'React Native',
};

const CATEGORY_TITLES: Record<Category, string> = {
  guidance: 'Official guidance',
  state: 'State and architecture libraries',
  'dependency-injection': 'Dependency injection',
  navigation: 'Navigation',
  samples: 'Sample apps',
  testing: 'Testing',
  tooling: 'Project structure and tooling',
};

/** GitHub's anchor for a heading made of letters, digits and spaces. */
export function headingAnchor(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, '')
    .replace(/ /g, '-');
}

export function renderList(entries: readonly Entry[]): string {
  const lines: string[] = [];
  const platforms = PLATFORMS.filter((platform) => entries.some((e) => e.platform === platform));
  const newest = entries.reduce((latest, e) => (e.verified > latest ? e.verified : latest), '');

  lines.push('## Contents', '');
  for (const platform of platforms) {
    const count = entries.filter((e) => e.platform === platform).length;
    const title = PLATFORM_TITLES[platform];
    lines.push(`- [${title}](#${headingAnchor(title)}) (${count})`);
  }
  lines.push(
    '',
    `${entries.length} entries. Each one was opened and checked by hand; the newest check is from ${newest}.`,
  );

  for (const platform of platforms) {
    lines.push('', `## ${PLATFORM_TITLES[platform]}`);
    for (const category of CATEGORIES) {
      const group = entries
        .filter((e) => e.platform === platform && e.category === category)
        .sort((a, b) => compareNames(a.name, b.name));
      if (group.length === 0) continue;
      lines.push('', `### ${CATEGORY_TITLES[category]}`, '');
      for (const entry of group) lines.push(`- [${entry.name}](${entry.url}) - ${entry.why}`);
    }
  }
  return lines.join('\n');
}

function compareNames(a: string, b: string): number {
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
}
