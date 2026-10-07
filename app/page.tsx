'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { PostEditor } from '@/components/editor/PostEditor';
import { LinkedInCard } from '@/components/preview/LinkedInCard';
import { MetricsBar } from '@/components/ui/MetricsBar';
import { DraftsDrawer } from '@/components/drafts/DraftsDrawer';
import { HookTemplatesModal } from '@/components/editor/HookTemplatesModal';
import { UnstyleModal } from '@/components/editor/UnstyleModal';
import { AccessibilityModal } from '@/components/ui/AccessibilityModal';
import {
  PostDraft,
  DraftsState,
} from '@/lib/drafts/types';
import {
  loadStoredState,
  saveStoredState,
  DEFAULT_INITIAL_DRAFT,
  INITIAL_STATE,
} from '@/lib/drafts/store';
import {
  tiptapToLinkedInText,
} from '@/lib/unicode/converter';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { HookTemplate } from '@/lib/templates/hooks';
import { PenTool, Eye, Check, Sparkles, Copy, ArrowRight } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<DraftsState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isCopied, setIsCopied] = useState(false);

  // Modals state
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isUnstyleOpen, setIsUnstyleOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load from local storage on mount
  useEffect(() => {
    const loaded = loadStoredState();
    setState(loaded);
    setMounted(true);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    if (mounted) {
      saveStoredState(state);
    }
  }, [state, mounted]);

  // Current active draft
  const activeDraft = useMemo(() => {
    return (
      state.drafts.find((d) => d.id === state.activeDraftId) ||
      state.drafts[0] ||
      DEFAULT_INITIAL_DRAFT
    );
  }, [state.drafts, state.activeDraftId]);

  // Real-time formatted output for LinkedIn
  const formattedLinkedInText = useMemo(() => {
    if (!activeDraft?.content) return '';
    return tiptapToLinkedInText(activeDraft.content, activeDraft.bulletStyle || 'bullet');
  }, [activeDraft?.content, activeDraft?.bulletStyle]);

  // Update active draft properties
  const updateActiveDraft = useCallback(
    (updates: Partial<PostDraft>) => {
      setState((prev) => {
        const nextDrafts = prev.drafts.map((draft) => {
          if (draft.id === prev.activeDraftId) {
            return {
              ...draft,
              ...updates,
              updatedAt: Date.now(),
            };
          }
          return draft;
        });
        return { ...prev, drafts: nextDrafts };
      });
    },
    []
  );

  // Draft Management Handlers
  const handleCreateDraft = () => {
    const newId = `draft-${Date.now()}`;
    const newDraft: PostDraft = {
      id: newId,
      title: `Draft #${state.drafts.length + 1}`,
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      },
      bulletStyle: 'bullet',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      activeDraftId: newId,
      drafts: [newDraft, ...prev.drafts],
    }));
  };

  const handleDeleteDraft = (id: string) => {
    setState((prev) => {
      const remaining = prev.drafts.filter((d) => d.id !== id);
      if (remaining.length === 0) return prev;
      const nextActiveId = prev.activeDraftId === id ? remaining[0].id : prev.activeDraftId;
      return {
        ...prev,
        activeDraftId: nextActiveId,
        drafts: remaining,
      };
    });
  };

  const handleDuplicateDraft = (id: string) => {
    const target = state.drafts.find((d) => d.id === id);
    if (!target) return;
    const newId = `draft-${Date.now()}`;
    const duplicated: PostDraft = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
    };
    setState((prev) => ({
      ...prev,
      activeDraftId: newId,
      drafts: [duplicated, ...prev.drafts],
    }));
  };

  const handleTogglePinDraft = (id: string) => {
    setState((prev) => ({
      ...prev,
      drafts: prev.drafts.map((d) => (d.id === id ? { ...d, isPinned: !d.isPinned } : d)),
    }));
  };

  const handleSelectDraft = (id: string) => {
    setState((prev) => ({ ...prev, activeDraftId: id }));
  };

  const handleApplyTemplate = (template: HookTemplate) => {
    updateActiveDraft({
      title: template.title,
      content: template.content,
    });
  };

  const handleApplyUnstyledText = (cleanText: string) => {
    const lines = cleanText.split('\n');
    const docNodes = lines.map((line) => ({
      type: 'paragraph',
      content: line.trim() ? [{ type: 'text', text: line }] : [],
    }));

    updateActiveDraft({
      content: {
        type: 'doc',
        content: docNodes,
      },
    });
  };

  const handleClearEditor = () => {
    if (confirm('Clear the current editor text?')) {
      updateActiveDraft({
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      });
    }
  };

  const handleCopy = async () => {
    if (!formattedLinkedInText) return;
    const success = await copyToClipboard(formattedLinkedInText);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (typeof document !== 'undefined') {
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-paper)] text-[var(--text-muted)] text-sm">
        Loading PostPolish...
      </div>
    );
  }

  const charCount = Array.from(formattedLinkedInText).length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)] text-[var(--text-primary)]">
      {/* Top App Bar */}
      <Header
        activeDraft={activeDraft}
        onDraftTitleChange={(title) => updateActiveDraft({ title })}
        onCopy={handleCopy}
        isCopied={isCopied}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenUnstyle={() => setIsUnstyleOpen(true)}
        onOpenA11yInfo={() => setIsA11yOpen(true)}
        draftsCount={state.drafts.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Mobile Sticky Tab Switcher */}
      <div className="lg:hidden sticky top-[57px] z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md px-3 py-2 flex items-center justify-between gap-2 shadow-xs">
        <div className="grid grid-cols-2 gap-1.5 w-full bg-[var(--bg-subtle)] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'write'
                ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Write & Format</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-[var(--bg-surface)] text-[var(--teal)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>LinkedIn Preview</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Split Panes on Desktop, Tabs on Mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col gap-6 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          {/* Editor Column (7 cols on desktop) */}
          <div
            className={`lg:col-span-7 flex flex-col ${
              activeTab === 'write' ? 'block' : 'hidden lg:flex'
            }`}
          >
            <PostEditor
              initialContent={activeDraft.content}
              bulletStyle={activeDraft.bulletStyle || 'bullet'}
              onBulletStyleChange={(style) => updateActiveDraft({ bulletStyle: style })}
              onChange={(content) => updateActiveDraft({ content })}
              onClear={handleClearEditor}
            />
          </div>

          {/* Preview Column (5 cols on desktop) */}
          <div
            className={`lg:col-span-5 flex flex-col ${
              activeTab === 'preview' ? 'block' : 'hidden lg:flex'
            }`}
          >
            <LinkedInCard
              formattedText={formattedLinkedInText}
              persona={state.persona}
              onPersonaChange={(persona) => setState((prev) => ({ ...prev, persona }))}
              previewMode={state.previewMode}
              onPreviewModeChange={(previewMode) => setState((prev) => ({ ...prev, previewMode }))}
              previewTheme={state.previewTheme}
              onPreviewThemeChange={(previewTheme) =>
                setState((prev) => ({ ...prev, previewTheme }))
              }
            />
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-xs">
          <MetricsBar formattedText={formattedLinkedInText} />
        </div>

        {/* Informational & SEO Section */}
        <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-[var(--text-secondary)]">
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-[var(--accent)]" />
              1. Visual Rich Formatting
            </h3>
            <p>
              Type naturally with a familiar toolbar and keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U). PostPolish translates your formatting to Unicode characters supported natively by LinkedIn.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[var(--teal)]" />
              2. Accurate Feed Fold Preview
            </h3>
            <p>
              See exactly where LinkedIn places the <em>"...see more"</em> button (~210 characters) on desktop and mobile feeds so your hook never gets cut off mid-thought.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              3. Built-in Safety Guardrails
            </h3>
            <p>
              Hashtags (<code>#marketing</code>), mentions (<code>@name</code>), URLs, and non-Latin alphabets are automatically protected from formatting to avoid broken links and corrupted text.
            </p>
          </div>
        </section>
      </main>

      {/* Footer with Attribution */}
      <Footer />

      {/* Sticky Bottom Action Bar for Mobile Devices (<1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-4 py-2.5 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] font-mono shrink-0 pl-1">
          <span className={`font-semibold ${charCount > 3000 ? 'text-red-500 font-bold' : ''}`}>
            {charCount.toLocaleString()}/3k
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-sans">chars</span>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'write' ? (
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[var(--teal)]" />
              <span>Preview</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
            >
              <PenTool className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Write</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
              isCopied
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : 'bg-[var(--accent)] active:scale-95 shadow-[var(--accent)]/30'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Drawer & Modals */}
      <DraftsDrawer
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        state={state}
        onSelectDraft={handleSelectDraft}
        onCreateDraft={handleCreateDraft}
        onDeleteDraft={handleDeleteDraft}
        onDuplicateDraft={handleDuplicateDraft}
        onTogglePinDraft={handleTogglePinDraft}
        onImportDrafts={(imported) => setState(imported)}
      />

      <HookTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleApplyTemplate}
      />

      <UnstyleModal
        isOpen={isUnstyleOpen}
        onClose={() => setIsUnstyleOpen(false)}
        onApplyUnstyled={handleApplyUnstyledText}
      />

      <AccessibilityModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
      />
    </div>
  );
}
