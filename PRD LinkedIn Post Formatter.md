# PRD: LinkedIn Post Formatter

**Working name:** PostPolish (placeholder, rename freely) **Stack:** Next.js (App Router) + TypeScript + Tailwind, hosted on Vercel Hobby (free) **Status:** Draft v1

## 1. Overview

LinkedIn's post editor has no formatting controls: no bold, italic, underline or lists. Creators work around this by pasting text made of special Unicode characters (for example 𝗯𝗼𝗹𝗱 or 𝘪𝘵𝘢𝘭𝘪𝘤). This product is a free, fast web editor where a person writes a post, formats it with a familiar toolbar, sees a live LinkedIn-style preview, and copies the result to paste into LinkedIn.

**One-line pitch:** Write once, format visually, paste into LinkedIn and it looks the way you intended.

## 2. Problem

- LinkedIn gives no native formatting, so posts look like walls of plain text.
- Existing tools are either cluttered with ads and upsells, or are full scheduling suites with accounts and paywalls.
- Most free formatters only convert a snippet of text and do not let you draft a whole post, with line breaks, lists, hooks and a preview.
- People cannot tell how a post will look in the feed before posting, especially where LinkedIn truncates it behind "see more".

## 3. Goals and non-goals

### Goals

1. Let a user format a full LinkedIn post in under 60 seconds and copy it with one click.
2. Show an accurate, live preview of how the post appears in the feed (desktop and mobile widths).
3. Work with no login and no backend cost, so it can live on Vercel's free tier.
4. Have its own clear visual identity and feel calm, quick and focused.

### Non-goals for v1

- Direct posting or scheduling to LinkedIn (needs LinkedIn OAuth and API approval).
- Teams, collaboration, analytics, or AI writing.
- Carousel or image creation.
- Support for X/Twitter, Threads and other networks.

## 4. Target users

| Persona | Need |
| --- | --- |
| Solo creator or founder | Posts 2 to 5 times a week, wants posts to stand out without paying for a suite |
| Job seeker or professional | Occasional posts, wants a clean, quick way to add emphasis and bullet lists |
| Social media manager | Drafts for several people, needs saved drafts and templates |

## 5. How LinkedIn formatting actually works (key constraint)

This shapes the whole product, so it is worth being precise.

- LinkedIn posts accept **plain text only**. There is no bold or italic markup.
- "Formatting" is done by swapping normal letters for look-alike characters from the Unicode **Mathematical Alphanumeric Symbols** block (bold, italic, bold italic, sans-serif variants, monospace, script, fraktur, double-struck).
- **Underline and strikethrough** are done by appending a combining character after each letter (for example U+0332 for underline, U+0336 for strikethrough). These render inconsistently across devices and fonts, so they must carry a warning in the UI.
- **Limitations the product must handle and communicate:**
  - Only Latin letters and digits have these variants. Hindi, Arabic, Chinese and other scripts cannot be styled, and the tool must leave them untouched rather than corrupt them.
  - Italic has no digit variants, so digits stay normal in italic mode.
  - Styled text is read poorly by screen readers and is not searchable as normal words. The product should recommend using styled text for short emphasis, not whole paragraphs.
  - Hashtags, @mentions and URLs must never be restyled, or they break.
  - Some older devices show empty boxes for rarely used styles, so v1 should stick to widely supported ones.
- LinkedIn post length limit is 3,000 characters, and the feed shows only the first few lines before "see more" (roughly 200 to 210 characters on desktop, fewer on mobile; verify current values before launch since LinkedIn changes this).

Because of these constraints, the editor should store the post as **structured rich text** and convert to Unicode only on output. This lets the user toggle formatting on and off freely without a lossy conversion.

## 6. Core features

### 6.1 MVP (v1)

**Editor**

- Rich text editor with a toolbar and keyboard shortcuts (Ctrl/Cmd + B, I, U).
- Inline styles: **bold**, *italic*, bold italic, underline, strikethrough, monospace.
- Optional decorative styles (script, double-struck) behind a "More styles" menu, with a note that they are less readable.
- Lists: bullet list (•, –, →, ✓ choices) and numbered list. Lists are produced as plain characters, since LinkedIn has no real lists.
- Insert helpers: divider line, emoji picker, line-break control that preserves blank lines.
- Clear formatting for the selection.
- Undo and redo.

**Live preview**

- Side-by-side LinkedIn-style post card showing the converted text.
- Toggle between desktop and mobile widths.
- A visible "see more" cut-off line so the user can check that the hook fits above the fold.
- Light and dark preview toggle.

**Output**

- One-click **Copy for LinkedIn** (copies the converted plain text to the clipboard) with a success confirmation.
- Character counter against the 3,000 limit, with a warning near the limit.
- Note: Unicode characters may count differently from how LinkedIn counts them, so the counter should be labelled approximate.

**Drafts**

- Auto-save to the browser's local storage, no account needed.
- Simple drafts list: create, rename, duplicate, delete.
- Export and import drafts as a JSON file so users do not lose work when clearing the browser.

**Safety rules in the converter**

- Skip hashtags, @mentions and URLs.
- Leave non-Latin characters untouched and show a small inline notice if the user tries to style them.
- Show a one-time accessibility tip about overusing styled text.

### 6.2 v1.1 (fast follow)

- Hook starter templates (story, listicle, lesson learned, announcement) the user can insert and edit.
- Saved snippets (signature, call-to-action, hashtag sets).
- Paste cleanup: paste text from Notion, Google Docs or Word and keep bold and italic.
- Reverse tool: paste an already styled LinkedIn post and convert it back to plain, editable text.
- Simple writing hints: hook length, paragraph length, number of hashtags.

### 6.3 Later

- Chrome extension that adds the toolbar inside LinkedIn's own composer.
- Optional sign-in with cloud-synced drafts.
- Scheduling and direct posting via LinkedIn's API.
- Multi-language UI.

## 7. User flows

**Primary flow**

1. User lands on the editor (no signup wall, the editor is the homepage).
2. Types or pastes text.
3. Selects words and applies bold, italic or list styles from a floating toolbar.
4. Checks the preview, especially the part above "see more".
5. Clicks **Copy for LinkedIn**, opens LinkedIn and pastes.

**Returning flow**

1. User opens the app, sees the last draft restored.
2. Picks another draft from the drafts panel or starts a new one.

## 8. UX and design direction

The goal is a product that is clearly its own, not a look-alike of Typefully or any other writing tool.

**Principles**

- **Editor first.** The writing surface and preview are the product. No marketing page in the way.
- **Calm and focused.** Low visual noise, generous whitespace, few controls visible at once.
- **Honest.** Clearly show limits (screen reader note, underline caveat) instead of hiding them.

**Suggested visual identity (to keep it distinct)**

- Warm off-white "paper" background with an ink-dark text color in light mode, and a deep charcoal (not pure black) dark mode.
- One confident accent color that is not LinkedIn blue and not the purple or blue common in writing tools. For example a deep teal or a warm coral.
- A serif or semi-serif display font for headings (such as Fraunces or Newsreader) paired with a clean sans for the interface (such as Inter or Geist). Both are free on Google Fonts.
- Rounded but not bubbly components, soft borders instead of heavy shadows.
- The preview card should resemble a LinkedIn post closely enough to be useful, but should not copy LinkedIn's logo or branding.

**Layout**

- Desktop: two panes, editor on the left, preview on the right, with a slim top bar (draft name, copy button, theme toggle).
- Mobile: tabs to switch between Write and Preview, with a sticky bottom toolbar for formatting and a sticky Copy button.
- Floating toolbar appears on text selection; a fixed toolbar is available for list and insert actions.

**Accessibility**

- Full keyboard navigation and visible focus states.
- Sufficient color contrast in both themes.
- Labels on all icon buttons.
- Respect reduced-motion settings.

## 9. Technical approach

**Framework and hosting**

- Next.js App Router with TypeScript, deployed on Vercel Hobby.
- Almost everything runs client-side, so there are no server costs and no database in v1. The editor page can be statically rendered.
- Tailwind CSS for styling, with a small set of reusable components (Radix UI or shadcn/ui primitives are a good fit for menus, popovers and dialogs).

**Editor engine**

- Recommended: **Tiptap** (built on ProseMirror). It gives selection toolbars, shortcuts, undo history and a clean document model out of the box.
- Alternative: Lexical, which is lighter but needs more custom work.
- Avoid a raw textarea with in-place character replacement. It makes toggling formatting off and mixing styles difficult.

**Converter module (core logic)**

- A pure, well-tested TypeScript function that takes the editor's document and returns a plain string.
- Per-style mapping tables from A–Z, a–z and 0–9 to the right Unicode code points, with fallbacks (for example, italic digits stay normal).
- Handles style combinations such as bold plus italic.
- Uses Unicode-aware iteration (for example `Array.from` or `Intl.Segmenter`) so emoji and combining characters are not split.
- Skips hashtags, mentions and URLs using a tokenizer step before mapping.
- A reverse mapper for the v1.1 "unstyle" tool.
- Unit tests covering every style, edge cases, emoji, mixed scripts and long text.

**Storage**

- Drafts in `localStorage` (or IndexedDB if drafts grow large), with a versioned schema so future changes can migrate old data.

**Other**

- Clipboard via the async Clipboard API with a fallback for older browsers.
- Basic privacy-friendly analytics (Vercel Web Analytics or Plausible) to learn which features are used, with no tracking of post content.
- SEO landing content (a short "how it works" and FAQ section below or beside the editor) so the tool can be found by searches such as "LinkedIn text formatter".

**Suggested folder structure**

- `app/` pages and layout
- `components/editor/` toolbar, editor, extensions
- `components/preview/` LinkedIn-style preview card
- `lib/unicode/` mapping tables and converter
- `lib/drafts/` storage helpers
- `tests/` converter unit tests

## 10. Free-hosting considerations

- Vercel's Hobby plan is free but is intended for **personal, non-commercial use**. If you plan to add ads, paid plans or run it as a business, check Vercel's current terms and budget for the Pro plan or another host.
- A client-side-only app stays well within free limits. Avoid heavy serverless functions or image generation in v1.
- Keep the bundle small (lazy-load the emoji picker and any rarely used styles) to keep the page fast.

## 11. Success metrics

| Metric | Target (first 3 months) |
| --- | --- |
| Time from landing to first copy | Under 60 seconds for most sessions |
| Sessions that end in a Copy click | 40% or more |
| Returning users (7-day) | 20% or more |
| Lighthouse performance and accessibility | 90+ |
| Converter bugs reported (broken characters) | Near zero |

## 12. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| LinkedIn changes how it handles Unicode or adds native formatting | Product value drops | Keep scope light and cheap to run, pivot toward templates, hooks and preview |
| Styled text hurts accessibility and reach | Reputation and user trust | Educate in-app, default to light use, warn on long styled passages |
| Characters render as empty boxes on some devices | Broken-looking posts | Offer only well-supported styles by default, add a compatibility note |
| Underline and strikethrough render unevenly | Inconsistent output | Label them as "may vary by device" |
| Looking too similar to existing tools | Weak differentiation | Follow the distinct design direction and focus on the live preview and hook checking |
| Free-tier limits or terms | Forced upgrade | Stay client-side, review Vercel terms before monetising |

## 13. Milestones

| Phase | Scope | Rough time |
| --- | --- | --- |
| 0. Setup | Next.js project, Tailwind, design tokens, Vercel deploy | 1 to 2 days |
| 1. Converter | Unicode mapping, tokenizer, tests | 2 to 3 days |
| 2. Editor | Tiptap setup, toolbar, shortcuts, lists | 4 to 5 days |
| 3. Preview and copy | LinkedIn-style card, see-more line, counter, copy | 3 to 4 days |
| 4. Drafts and polish | Local drafts, export/import, dark mode, mobile layout, accessibility pass | 4 to 5 days |
| 5. Launch | Landing copy, SEO, analytics, share on LinkedIn | 2 days |

Total is roughly 3 to 4 weeks for one developer working part time.

## 14. Open questions

1. Final product name and domain?
2. Should v1 include hook templates, or ship them in v1.1?
3. Is monetisation planned (which affects the hosting plan)?
4. Is the Chrome extension a priority after launch?
5. Which languages should the interface support first?

## 15. Acceptance criteria for v1

- A user can write a post, apply bold, italic, bold italic, underline, strikethrough and monospace, and create bullet and numbered lists.
- The preview matches the copied output exactly.
- Copied text pastes into LinkedIn on desktop and mobile and displays as styled.
- Hashtags, mentions, URLs and non-Latin text are never altered.
- Drafts persist across page reloads and can be exported and imported.
- The app works on current Chrome, Safari, Firefox and Edge, and on mobile screens.
- Lighthouse accessibility score is 90 or higher.
