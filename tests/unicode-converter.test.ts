// Unit tests for Unicode Converter, Tokenizer, and Unstyle using Node test runner
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatString, tiptapToLinkedInText } from '../lib/unicode/converter';
import { tokenizeText } from '../lib/unicode/tokenizer';
import { unstyleText } from '../lib/unicode/unstyle';

describe('Tokenizer', () => {
  it('should identify URLs, hashtags, mentions, and plain text', () => {
    const input = 'Check out https://example.com and #tech with @john!';
    const tokens = tokenizeText(input);

    assert.deepEqual(tokens, [
      { type: 'text', value: 'Check out ' },
      { type: 'url', value: 'https://example.com' },
      { type: 'text', value: ' and ' },
      { type: 'hashtag', value: '#tech' },
      { type: 'text', value: ' with ' },
      { type: 'mention', value: '@john' },
      { type: 'text', value: '!' },
    ]);
  });
});

describe('Unicode Converter', () => {
  it('should format bold text properly without breaking numbers', () => {
    const formatted = formatString('Hello 123', { style: 'bold' });
    assert.equal(formatted, '𝐇𝐞𝐥𝐥𝐨 𝟏𝟐𝟑');
  });

  it('should format italic text without altering numbers', () => {
    const formatted = formatString('Hello 123', { style: 'italic' });
    assert.equal(formatted, '𝐻𝑒𝑙𝑙𝑜 123');
  });

  it('should format monospace text', () => {
    const formatted = formatString('code 42', { style: 'monospace' });
    assert.equal(formatted, '𝚌𝚘𝚍𝚎 𝟺𝟸');
  });

  it('should preserve hashtags, mentions and URLs when formatting', () => {
    const formatted = formatString('Follow @elon on #AI at https://x.com now', { style: 'bold' });
    assert.ok(formatted.includes('@elon'));
    assert.ok(formatted.includes('#AI'));
    assert.ok(formatted.includes('https://x.com'));
    assert.ok(formatted.startsWith('𝐅𝐨𝐥𝐥𝐨𝐰'));
  });

  it('should apply underline combining mark', () => {
    const formatted = formatString('Hi', { underline: true });
    assert.ok(formatted.includes('\u0332'));
  });

  it('should leave non-Latin scripts unmodified', () => {
    const formatted = formatString('नमस्ते दुनिया مرحبا بالعالم', { style: 'bold' });
    assert.equal(formatted, 'नमस्ते दुनिया مرحبا بالعالم');
  });
});

describe('Unstyle Tool', () => {
  it('should reverse bold and italic Unicode back to plain text', () => {
    const styled = '𝐇𝐞𝐥𝐥𝐨 𝟏𝟐𝟑 𝐻𝑒𝑙𝑙𝑜 𝚌𝚘𝚍𝚎';
    const clean = unstyleText(styled);
    assert.equal(clean, 'Hello 123 Hello code');
  });

  it('should strip underline and strikethrough marks', () => {
    const styled = 'H\u0332e\u0332l\u0332l\u0332o\u0332 W\u0336o\u0336r\u0336l\u0336d\u0336';
    const clean = unstyleText(styled);
    assert.equal(clean, 'Hello World');
  });
});

describe('Tiptap Document Serializer', () => {
  it('should convert paragraphs and bullet lists with chosen markers', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hook line here',
              marks: [{ type: 'bold' }],
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Point one' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Point two' }],
                },
              ],
            },
          ],
        },
      ],
    };

    const output = tiptapToLinkedInText(doc, 'arrow');
    assert.ok(output.includes('𝐇𝐨𝐨𝐤 𝐥𝐢𝐧𝐞 𝐡𝐞𝐫𝐞'));
    assert.ok(output.includes('→ Point one'));
    assert.ok(output.includes('→ Point two'));
  });
});
