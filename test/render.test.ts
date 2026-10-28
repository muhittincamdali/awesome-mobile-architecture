import { describe, expect, it } from 'vitest';
import type { Entry } from '../src/entries.ts';
import { LIST_END, LIST_START, headingAnchor, renderList } from '../src/render.ts';
import { MarkerError, readBlock, replaceBlock } from '../src/readme.ts';

function entry(overrides: Partial<Entry>): Entry {
  return {
    name: 'Name',
    url: 'https://example.org/name',
    platform: 'ios',
    category: 'state',
    why: 'A reason that is long enough.',
    verified: '2026-10-01',
    ...overrides,
  };
}

describe('renderList', () => {
  const entries = [
    entry({ name: 'zeta', url: 'https://example.org/z' }),
    entry({ name: 'Alpha', url: 'https://example.org/a', verified: '2026-10-28' }),
    entry({ name: 'Guide', url: 'https://example.org/g', category: 'guidance' }),
    entry({ name: 'Riverpod', url: 'https://example.org/r', platform: 'flutter' }),
  ];
  const output = renderList(entries);

  it('links each platform that has entries, with its count', () => {
    expect(output).toContain('- [iOS](#ios) (3)');
    expect(output).toContain('- [Flutter](#flutter) (1)');
    expect(output).not.toContain('React Native');
  });

  it('states the total and the newest manual check', () => {
    expect(output).toContain(
      '4 entries. Each one was opened and checked by hand; the newest check is from 2026-10-28.',
    );
  });

  it('orders categories by the fixed category order and names case-insensitively', () => {
    const guidance = output.indexOf('### Official guidance');
    const state = output.indexOf('### State and architecture libraries');
    expect(guidance).toBeGreaterThan(-1);
    expect(guidance).toBeLessThan(state);
    expect(output.indexOf('[Alpha]')).toBeLessThan(output.indexOf('[zeta]'));
  });

  it('writes one list item per entry', () => {
    expect(output).toContain('- [Alpha](https://example.org/a) - A reason that is long enough.');
    expect(output.match(/^- \[/gm)).toHaveLength(4 + 2);
  });

  it('is independent of the input order', () => {
    expect(renderList([...entries].reverse())).toBe(output);
  });
});

describe('headingAnchor', () => {
  it('matches the anchors GitHub generates', () => {
    expect(headingAnchor('React Native')).toBe('react-native');
    expect(headingAnchor('Concepts that apply everywhere')).toBe('concepts-that-apply-everywhere');
    expect(headingAnchor('iOS')).toBe('ios');
  });
});

describe('README block', () => {
  const readme = `# Title\n\n${LIST_START}\n\nold\n\n${LIST_END}\n\n## After\n`;

  it('replaces only the text between the markers', () => {
    const updated = replaceBlock(readme, LIST_START, LIST_END, 'new');
    expect(updated).toBe(`# Title\n\n${LIST_START}\n\nnew\n\n${LIST_END}\n\n## After\n`);
    expect(readBlock(updated, LIST_START, LIST_END)).toBe('new');
  });

  it('is stable when the same content is written twice', () => {
    const once = replaceBlock(readme, LIST_START, LIST_END, 'new');
    expect(replaceBlock(once, LIST_START, LIST_END, 'new')).toBe(once);
  });

  it('refuses missing, repeated or reversed markers', () => {
    expect(() => readBlock('# no markers', LIST_START, LIST_END)).toThrow(MarkerError);
    expect(() => readBlock(`${readme}${LIST_START}`, LIST_START, LIST_END)).toThrow(
      /found 2 and 1/,
    );
    expect(() => readBlock(`${LIST_END} x ${LIST_START}`, LIST_START, LIST_END)).toThrow(
      /comes before/,
    );
  });
});
