// Reads and replaces the generated block of README.md without touching anything around it.

export class MarkerError extends Error {}

/** Replaces the text between `start` and `end` with `content`; the markers stay. */
export function replaceBlock(text: string, start: string, end: string, content: string): string {
  const { from, to } = locateBlock(text, start, end);
  return `${text.slice(0, from)}\n\n${content}\n\n${text.slice(to)}`;
}

/** The text between the markers, without the blank lines that frame it. */
export function readBlock(text: string, start: string, end: string): string {
  const { from, to } = locateBlock(text, start, end);
  return text.slice(from, to).trim();
}

function locateBlock(text: string, start: string, end: string): { from: number; to: number } {
  const startCount = text.split(start).length - 1;
  const endCount = text.split(end).length - 1;
  if (startCount !== 1 || endCount !== 1) {
    throw new MarkerError(
      `expected one ${start} and one ${end}, found ${startCount} and ${endCount}`,
    );
  }
  const from = text.indexOf(start) + start.length;
  const to = text.indexOf(end);
  if (to < from) throw new MarkerError(`${end} comes before ${start}`);
  return { from, to };
}
