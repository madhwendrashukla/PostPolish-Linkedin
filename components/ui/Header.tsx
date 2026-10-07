'use client';

import React from 'react';
import {
  Copy,
  Check,
  FolderOpen,
  BookOpen,
  Wand2,
  Sun,
  Moon,
  Info,
} from 'lucide-react';
import { PostDraft } from '@/lib/drafts/types';

interface HeaderProps {
  activeDraft: PostDraft;
  onDraftTitleChange: (title: string) => void;
  onCopy: () => void;
  isCopied: boolean;
  onOpenDrafts: () => void;
  onOpenTemplates: () => void;
  onOpenUnstyle: () => void;
  onOpenA11yInfo: () => void;
  draftsCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeDraft,
  onDraftTitleChange,
  onCopy,
  isCopied,
  onOpenDrafts,
  onOpenTemplates,
  onOpenUnstyle,
  onOpenA11yInfo,
  draftsCount,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Draft Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-sm shadow-[var(--accent)]/30 font-serif font-bold text-lg sm:text-xl shrink-0">
              P
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
                  PostPolish
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                  LinkedIn
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-[var(--border-subtle)] hidden sm:block" />

          {/* Inline Editable Draft Title */}
          <div className="flex items-center min-w-0">
            <input
              type="text"
              value={activeDraft.title}
              onChange={(e) => onDraftTitleChange(e.target.value)}
              placeholder="Untitled Draft"
              className="bg-transparent hover:bg-[var(--bg-subtle)] focus:bg-[var(--bg-subtle)] px-2 py-1 rounded-lg text-xs sm:text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all w-28 sm:w-44 md:w-56 truncate"
              title="Click to rename draft"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Templates */}
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="Browse hook starter templates"
          >
            <BookOpen className="w-4 h-4 text-[var(--teal)]" />
            <span className="hidden md:inline">Templates</span>
          </button>

          {/* Unstyle Tool */}
          <button
            onClick={onOpenUnstyle}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="Unstyle / Clean formatted text back to plain text"
          >
            <Wand2 className="w-4 h-4 text-[var(--accent)]" />
            <span className="hidden md:inline">Unstyle</span>
          </button>

          {/* Drafts Drawer Toggle */}
          <button
            onClick={onOpenDrafts}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors relative"
            title="Saved Drafts"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Drafts</span>
            {draftsCount > 0 && (
              <span className="text-[10px] font-semibold bg-[var(--bg-subtle)] px-1.5 py-0.2 rounded-full text-[var(--text-muted)]">
                {draftsCount}
              </span>
            )}
          </button>

          {/* Accessibility Info Tip */}
          <button
            onClick={onOpenA11yInfo}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors hidden sm:inline-flex"
            title="Formatting & Accessibility Guide"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary CTA: Copy for LinkedIn (Compact on mobile) */}
          <button
            onClick={onCopy}
            id="copy-for-linkedin-btn"
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              isCopied
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-[var(--accent)]/30 active:scale-95'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span className="hidden xs:inline">Copied!</span>
                <span className="xs:hidden">Done</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Copy for LinkedIn</span>
                <span className="sm:hidden">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
