// Unstyle tool: converts styled Unicode characters back to plain ASCII text and strips combining marks

import { REVERSE_MAP, COMBINING_UNDERLINE, COMBINING_STRIKETHROUGH } from './char-maps';

/**
 * Strips combining diacritics (like underline \u0332 and strikethrough \u0336)
 * and maps Mathematical Alphanumeric Unicode symbols back to standard ASCII.
 */
export function unstyleText(styledText: string): string {
  if (!styledText) return '';

  // 1. Remove combining marks
  let cleanText = styledText
    .split(COMBINING_UNDERLINE)
    .join('')
    .split(COMBINING_STRIKETHROUGH)
    .join('');

  // 2. Map mathematical alphanumeric characters back to ASCII
  let result = '';
  // Iterate code points safely
  for (const char of cleanText) {
    if (REVERSE_MAP.has(char)) {
      result += REVERSE_MAP.get(char);
    } else {
      result += char;
    }
  }

  return result;
}
