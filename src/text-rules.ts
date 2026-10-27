// Character rules shared by the text fields (name, why) and the link of an entry.

// Control characters and the Unicode line/paragraph separators would break the one-line rule.
export const LINE_BREAKING = /[\u0000-\u001f\u007f\u2028\u2029]/;
// Zero-width and bidirectional control characters can make rendered text read differently from
// the reviewed source (a name that looks like another, a reason whose words appear reordered).
// \p{Cf} covers the format characters (soft hyphen, zero-width and text-direction marks, BOM,
// assigned tag characters). The rest render as nothing or as a blank yet are letters or marks:
// combining grapheme joiner, Hangul and Khmer fillers, variation selectors, Braille blank, and
// the whole tag block including its unassigned code points.
export const INVISIBLE =
  /[\p{Cf}\u034f\u115f\u1160\u17b4\u17b5\u180b-\u180f\u2800\u3164\ufe00-\ufe0f\uffa0\u{e0000}-\u{e007f}\u{e0100}-\u{e01ef}]/u;
// GitHub decodes "&#x202E;", "&#64;" and named references such as "&ZeroWidthSpace;" in text and
// in link targets, so the rendered page would hold a character the rules above never saw. Any
// "&#" and any "&name;" is refused, which needs no list of the names GitHub knows.
export const CHARACTER_REFERENCE = /&(?:#|[A-Za-z][A-Za-z0-9]*;)/;
export const CHARACTER_REFERENCE_ERROR =
  'contains an HTML character reference; write the character itself';
