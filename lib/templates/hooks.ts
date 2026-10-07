import { TiptapNode } from '../unicode/converter';

export interface HookTemplate {
  id: string;
  category: 'Story' | 'Framework' | 'Contrarian' | 'Listicle' | 'Announcement';
  title: string;
  description: string;
  content: TiptapNode;
}

export const HOOK_TEMPLATES: HookTemplate[] = [
  {
    id: 'contrarian-truth',
    category: 'Contrarian',
    title: 'The Uncomfortable Truth',
    description: 'Challenge conventional wisdom to stop the scroll.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Unpopular opinion: Most advice about [Topic] is completely backwards.',
              marks: [{ type: 'bold' }],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Here is what 99% of people get wrong — and the 1 rule that actually works:',
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
                  content: [{ type: 'text', text: 'Mistake #1: Focusing on vanity metrics over leverage' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Mistake #2: Scaling before you have product-market fit' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'The Fix: Do what does not scale, then systematize' }],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Have you seen this in your industry? Share your thoughts below.',
              marks: [{ type: 'italic' }],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'story-breakthrough',
    category: 'Story',
    title: 'Failure to Breakthrough Story',
    description: 'Vulnerable hook leading to an actionable transformation.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '2 years ago, I lost my biggest client and almost quit.',
              marks: [{ type: 'bold' }],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Today, that failure became the foundation for our fastest growing product line.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '3 key lessons I wish someone had told me back then:',
              marks: [{ type: 'italic' }],
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
                  content: [{ type: 'text', text: '1. Diversification is insurance against volatility.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '2. Client feedback during churn is pure gold.' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '3. Never let short-term panic dictate long-term roadmap.' }],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Drop a 💡 if you have ever turned a setback into a springboard.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'framework-playbook',
    category: 'Framework',
    title: 'Step-by-Step Playbook',
    description: 'High-utility framework that earns bookmarks and reposts.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'How to achieve [Goal] in 30 days (without burning out):',
              marks: [{ type: 'bold' }],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'I spent 6 months refining this 4-step framework. Steal it:',
            },
          ],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Audit where you waste 80% of your daily energy' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Build an automated template for repetitive workflows' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Block 90 minutes of uninterrupted deep work every morning' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Review weekly progress and iterate relentlessly' }],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Bookmark this post for your next planning session 📌',
              marks: [{ type: 'bold' }],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'listicle-resources',
    category: 'Listicle',
    title: 'Curated Resource List',
    description: 'High-density curated tools or tips that get shared.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '5 free tools that will save you 10+ hours every week:',
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
                  content: [{ type: 'text', text: 'Tool 1: Best for async team alignment' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Tool 2: Clean and fast visual formatting' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Tool 3: Automated document summaries' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Tool 4: Distraction-free deep work timer' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Tool 5: Smart prompt generator' }],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Which one is already part of your daily stack?',
              marks: [{ type: 'italic' }],
            },
          ],
        },
      ],
    },
  },
];
