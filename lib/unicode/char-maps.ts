// Unicode Character Maps for LinkedIn Post Formatter

export type TextStyleType = 
  | 'normal'
  | 'bold'
  | 'italic'
  | 'boldItalic'
  | 'monospace'
  | 'script'
  | 'scriptBold'
  | 'doubleStruck'
  | 'fraktur'
  | 'sans'
  | 'sansBold'
  | 'sansItalic'
  | 'sansBoldItalic';

export interface StyleOptions {
  style?: TextStyleType;
  underline?: boolean;
  strikethrough?: boolean;
}

// Combining Characters
export const COMBINING_UNDERLINE = '\u0332'; // Combining Low Line
export const COMBINING_STRIKETHROUGH = '\u0336'; // Combining Long Stroke Overlay

// Explicit exception mappings for Unicode Mathematical Alphanumerics (where characters are in Letterlike Symbols block)
const SCRIPT_UPPER_EXCEPTIONS: Record<string, string> = {
  B: '\u212C', // ℬ
  E: '\u2130', // ℰ
  F: '\u2131', // ℱ
  H: '\u210B', // ℋ
  I: '\u2110', // ℐ
  L: '\u2112', // ℒ
  M: '\u2133', // ℳ
  R: '\u211B', // ℛ
};

const SCRIPT_LOWER_EXCEPTIONS: Record<string, string> = {
  e: '\u212F', // ℯ
  g: '\u210A', // ℊ
  o: '\u2134', // ℴ
};

const DOUBLE_STRUCK_UPPER_EXCEPTIONS: Record<string, string> = {
  C: '\u2102', // ℂ
  H: '\u210D', // ℍ
  N: '\u2115', // ℕ
  P: '\u2119', // ℙ
  Q: '\u211A', // ℚ
  R: '\u211D', // ℝ
  Z: '\u2124', // ℤ
};

const FRAKTUR_UPPER_EXCEPTIONS: Record<string, string> = {
  C: '\u212D', // ℭ
  H: '\u210C', // ℌ
  I: '\u2111', // ℑ
  R: '\u211C', // ℜ
  Z: '\u2128', // ℨ
};

function buildAlphaMap(
  upperStart: number,
  lowerStart: number,
  digitStart?: number,
  upperExceptions: Record<string, string> = {},
  lowerExceptions: Record<string, string> = {}
): Record<string, string> {
  const map: Record<string, string> = {};

  // Uppercase A-Z
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(65 + i);
    map[char] = upperExceptions[char] || String.fromCodePoint(upperStart + i);
  }

  // Lowercase a-z
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(97 + i);
    map[char] = lowerExceptions[char] || String.fromCodePoint(lowerStart + i);
  }

  // Digits 0-9
  if (digitStart !== undefined) {
    for (let i = 0; i < 10; i++) {
      const char = String.fromCharCode(48 + i);
      map[char] = String.fromCodePoint(digitStart + i);
    }
  }

  return map;
}

// Build standard character maps
export const CHAR_MAPS: Record<TextStyleType, Record<string, string>> = {
  normal: {},
  // Bold Serif (default bold)
  bold: buildAlphaMap(0x1D400, 0x1D41A, 0x1D7CE),
  // Italic Serif: 'h' is \u210E
  italic: buildAlphaMap(0x1D434, 0x1D44E, undefined, {}, { h: '\u210E' }),
  // Bold Italic Serif
  boldItalic: buildAlphaMap(0x1D468, 0x1D482),
  // Monospace
  monospace: buildAlphaMap(0x1D670, 0x1D68A, 0x1D7F6),
  // Script / Cursive
  script: buildAlphaMap(0x1D49C, 0x1D4B6, undefined, SCRIPT_UPPER_EXCEPTIONS, SCRIPT_LOWER_EXCEPTIONS),
  // Bold Script
  scriptBold: buildAlphaMap(0x1D4D0, 0x1D4EA),
  // Double-Struck (Blackboard Bold)
  doubleStruck: buildAlphaMap(0x1D538, 0x1D552, 0x1D7D8, DOUBLE_STRUCK_UPPER_EXCEPTIONS),
  // Fraktur (Gothic)
  fraktur: buildAlphaMap(0x1D504, 0x1D51E, undefined, FRAKTUR_UPPER_EXCEPTIONS),
  // Sans-Serif Regular
  sans: buildAlphaMap(0x1D5A0, 0x1D5BA, 0x1D7E2),
  // Sans-Serif Bold
  sansBold: buildAlphaMap(0x1D5D4, 0x1D5EE, 0x1D7EC),
  // Sans-Serif Italic
  sansItalic: buildAlphaMap(0x1D608, 0x1D622),
  // Sans-Serif Bold Italic
  sansBoldItalic: buildAlphaMap(0x1D63C, 0x1D656),
};

// Build reverse map for unstyling
export const REVERSE_MAP: Map<string, string> = new Map();

// Populate reverse map from all style maps
Object.entries(CHAR_MAPS).forEach(([styleKey, map]) => {
  if (styleKey === 'normal') return;
  Object.entries(map).forEach(([plainChar, styledChar]) => {
    REVERSE_MAP.set(styledChar, plainChar);
  });
});
