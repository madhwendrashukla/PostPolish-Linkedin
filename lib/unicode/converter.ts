// Unicode text converter module for LinkedIn Post Formatter
import {
  TextStyleType,
  StyleOptions,
  CHAR_MAPS,
  COMBINING_UNDERLINE,
  COMBINING_STRIKETHROUGH
} from './char-maps';
import { tokenizeText } from './tokenizer';

/**
 * Format a single character / grapheme cluster with style mappings and combining diacritics.
 */
export function styleCharacter(
  char: string,
  style: TextStyleType = 'normal',
  underline = false,
  strikethrough = false
): string {
  // If character is a newline or whitespace, do not attach combining marks or styles
  if (/^\s+$/.test(char)) {
    return char;
  }

  let result = char;

  // Apply alphanumeric style map if available for Latin letters/digits
  if (style !== 'normal' && CHAR_MAPS[style]) {
    const map = CHAR_MAPS[style];
    if (map[char]) {
      result = map[char];
    }
  }

  // Append combining strikethrough if active
  if (strikethrough) {
    result += COMBINING_STRIKETHROUGH;
  }

  // Append combining underline if active
  if (underline) {
    result += COMBINING_UNDERLINE;
  }

  return result;
}

/**
 * Format a plain string with the given style options, protecting URLs, #hashtags, @mentions, and emails.
 */
export function formatString(text: string, options: StyleOptions = {}): string {
  if (!text) return '';

  const { style = 'normal', underline = false, strikethrough = false } = options;

  // If no formatting requested, return plain text
  if (style === 'normal' && !underline && !strikethrough) {
    return text;
  }

  const tokens = tokenizeText(text);

  return tokens
    .map((token) => {
      // Protected tokens (URLs, hashtags, mentions, emails) are preserved as-is
      if (token.type !== 'text') {
        return token.value;
      }

      // Convert characters safely handling Unicode code points & grapheme clusters
      // Intl.Segmenter is supported in all modern browsers and Node 16+
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        const segments = segmenter.segment(token.value);
        let styled = '';
        for (const { segment } of segments) {
          styled += styleCharacter(segment, style, underline, strikethrough);
        }
        return styled;
      }

      // Fallback: Array.from iterates over Unicode code points
      return Array.from(token.value)
        .map((ch) => styleCharacter(ch, style, underline, strikethrough))
        .join('');
    })
    .join('');
}

export type BulletStyle = 'bullet' | 'dash' | 'arrow' | 'check' | 'number';

export const BULLET_MARKERS: Record<BulletStyle, string> = {
  bullet: '• ',
  dash: '– ',
  arrow: '→ ',
  check: '✓ ',
  number: '1. ', // Dynamic number prefix handled during iteration
};

export interface TiptapMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

/**
 * Converts a Tiptap JSON document node tree into a LinkedIn formatted plain text string.
 */
export function tiptapToLinkedInText(
  doc: TiptapNode | null | undefined,
  bulletStyle: BulletStyle = 'bullet'
): string {
  if (!doc) return '';

  function processNode(node: TiptapNode, index = 0, total = 1, listType?: string, itemIndex = 1): string {
    switch (node.type) {
      case 'doc':
        return (node.content || [])
          .map((child, i) => processNode(child, i, node.content?.length || 0))
          .join('\n\n');

      case 'paragraph': {
        if (!node.content || node.content.length === 0) {
          return '';
        }
        return node.content.map((child) => processNode(child)).join('');
      }

      case 'heading': {
        const text = (node.content || []).map((child) => processNode(child)).join('');
        // Headings can be rendered as bold text on LinkedIn
        return formatString(text, { style: 'bold' });
      }

      case 'bulletList':
      case 'bullet_list': {
        return (node.content || [])
          .map((child, i) => processNode(child, i, node.content?.length || 0, 'bulletList', i + 1))
          .join('\n');
      }

      case 'orderedList':
      case 'ordered_list': {
        const start = node.attrs?.start || 1;
        return (node.content || [])
          .map((child, i) => processNode(child, i, node.content?.length || 0, 'orderedList', start + i))
          .join('\n');
      }

      case 'listItem':
      case 'list_item': {
        const contentText = (node.content || []).map((child) => processNode(child)).join('');
        let prefix = BULLET_MARKERS[bulletStyle] || '• ';
        if (listType === 'orderedList') {
          prefix = `${itemIndex}. `;
        }
        return `${prefix}${contentText}`;
      }

      case 'horizontalRule':
      case 'horizontal_rule':
        return '───────────────';

      case 'codeBlock':
      case 'code_block': {
        const codeText = (node.content || []).map((child) => processNode(child)).join('');
        return formatString(codeText, { style: 'monospace' });
      }

      case 'blockquote': {
        const quoteText = (node.content || []).map((child) => processNode(child)).join('\n');
        return quoteText
          .split('\n')
          .map((line) => `“ ${line}`)
          .join('\n');
      }

      case 'hardBreak':
      case 'hard_break':
        return '\n';

      case 'text': {
        if (!node.text) return '';

        let style: TextStyleType = 'normal';
        let underline = false;
        let strikethrough = false;

        if (node.marks && node.marks.length > 0) {
          const markTypes = node.marks.map((m) => m.type);
          const hasBold = markTypes.includes('bold');
          const hasItalic = markTypes.includes('italic');
          const hasCode = markTypes.includes('code');
          underline = markTypes.includes('underline');
          strikethrough = markTypes.includes('strike') || markTypes.includes('strikethrough');

          // Check for custom style attributes if attached to custom marks or styles
          const customStyleMark = node.marks.find((m) => m.attrs?.fontStyle);
          if (customStyleMark?.attrs?.fontStyle) {
            style = customStyleMark.attrs.fontStyle;
          } else if (hasBold && hasItalic) {
            style = 'boldItalic';
          } else if (hasBold) {
            style = 'bold';
          } else if (hasItalic) {
            style = 'italic';
          } else if (hasCode) {
            style = 'monospace';
          }
        }

        return formatString(node.text, { style, underline, strikethrough });
      }

      default:
        if (node.content) {
          return node.content.map((child) => processNode(child)).join('');
        }
        return node.text || '';
    }
  }

  return processNode(doc);
}
