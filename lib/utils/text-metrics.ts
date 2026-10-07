export interface TextMetrics {
  charCount: number;
  wordCount: number;
  lineCount: number;
  readingTimeSeconds: number;
  hashtagCount: number;
  hookCharCount: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
  hasStyledOveruseWarning: boolean;
}

const LINKEDIN_CHAR_LIMIT = 3000;
const NEAR_LIMIT_THRESHOLD = 2700;

export function analyzePostText(text: string): TextMetrics {
  if (!text) {
    return {
      charCount: 0,
      wordCount: 0,
      lineCount: 0,
      readingTimeSeconds: 0,
      hashtagCount: 0,
      hookCharCount: 0,
      isOverLimit: false,
      isNearLimit: false,
      hasStyledOveruseWarning: false,
    };
  }

  // Segmenter-aware character count or array code points count
  const chars = Array.from(text);
  const charCount = chars.length;

  // Words count
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Lines
  const lines = text.split('\n');
  const lineCount = lines.length;

  // Average reading speed: 220 words per minute -> ~3.6 words per second
  const readingTimeSeconds = Math.max(1, Math.round((wordCount / 220) * 60));

  // Hashtags
  const hashtags = text.match(/#[a-zA-Z0-9_\u0080-\uFFFF]+/g) || [];
  const hashtagCount = hashtags.length;

  // Hook length: first paragraph or first 2 lines (before empty line or first ~210 chars)
  const firstNonEmptyLine = lines.find((l) => l.trim().length > 0) || '';
  const hookCharCount = Array.from(firstNonEmptyLine).length;

  // Check for overuse of mathematical alphanumeric symbols (>35% of total text styled)
  // Mathematical Alphanumeric Symbols are in range \u{1D400} to \u{1D7FF}
  const mathAlphanumericMatches = text.match(/[\u{1D400}-\u{1D7FF}]/gu) || [];
  const hasStyledOveruseWarning =
    charCount > 100 && mathAlphanumericMatches.length / charCount > 0.35;

  return {
    charCount,
    wordCount,
    lineCount,
    readingTimeSeconds,
    hashtagCount,
    hookCharCount,
    isOverLimit: charCount > LINKEDIN_CHAR_LIMIT,
    isNearLimit: charCount >= NEAR_LIMIT_THRESHOLD && charCount <= LINKEDIN_CHAR_LIMIT,
    hasStyledOveruseWarning,
  };
}
