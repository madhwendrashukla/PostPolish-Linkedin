'use client';

import React, { useState } from 'react';
import { X, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { HOOK_TEMPLATES, HookTemplate } from '@/lib/templates/hooks';
import { TiptapNode } from '@/lib/unicode/converter';

interface HookTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: HookTemplate) => void;
}

const CATEGORIES: ('All' | 'Contrarian' | 'Story' | 'Framework' | 'Listicle')[] = [
  'All',
  'Contrarian',
  'Story',
  'Framework',
  'Listicle',
];

export const HookTemplatesModal: React.FC<HookTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filtered =
    selectedCategory === 'All'
      ? HOOK_TEMPLATES
      : HOOK_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--teal)]" />
            <div>
              <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                Hook Starter Templates
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Proven structures designed to stop the scroll and capture attention above the fold.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-paper)]/40 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--teal)] bg-[var(--bg-surface)] hover:bg-[var(--teal-subtle)]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--teal)]">
                    {template.category}
                  </span>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                    {template.title}
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {template.description}
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--bg-subtle)] group-hover:bg-[var(--teal)] group-hover:text-white text-xs font-semibold text-[var(--text-primary)] transition-all shrink-0 self-end sm:self-auto"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
