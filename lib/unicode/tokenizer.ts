// Tokenizer to detect and protect URLs, #hashtags, @mentions, and emails from formatting

export interface TextToken {
  type: 'text' | 'url' | 'hashtag' | 'mention' | 'email';
  value: string;
}

// Regex patterns for protected entities
const URL_REGEX = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))/gi;
const HASHTAG_REGEX = /(#[a-zA-Z0-9_\u0080-\uFFFF]+)/g;
const MENTION_REGEX = /(@[a-zA-Z0-9_.\-]+)/g;
const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

// Combined master regex
const COMBINED_PROTECTED_REGEX = new RegExp(
  `(${URL_REGEX.source}|${EMAIL_REGEX.source}|${HASHTAG_REGEX.source}|${MENTION_REGEX.source})`,
  'gi'
);

export function tokenizeText(input: string): TextToken[] {
  if (!input) return [];

  const tokens: TextToken[] = [];
  let lastIndex = 0;
  
  // Reset regex state
  COMBINED_PROTECTED_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = COMBINED_PROTECTED_REGEX.exec(input)) !== null) {
    const matchIndex = match.index;
    const matchText = match[0];

    // Push preceding normal text if any
    if (matchIndex > lastIndex) {
      tokens.push({
        type: 'text',
        value: input.slice(lastIndex, matchIndex)
      });
    }

    // Determine type of protected entity
    let type: TextToken['type'] = 'text';
    if (/^https?:\/\//i.test(matchText)) {
      type = 'url';
    } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(matchText)) {
      type = 'email';
    } else if (matchText.startsWith('#')) {
      type = 'hashtag';
    } else if (matchText.startsWith('@')) {
      type = 'mention';
    }

    tokens.push({
      type,
      value: matchText
    });

    lastIndex = matchIndex + matchText.length;
  }

  // Push any remaining text
  if (lastIndex < input.length) {
    tokens.push({
      type: 'text',
      value: input.slice(lastIndex)
    });
  }

  return tokens;
}
