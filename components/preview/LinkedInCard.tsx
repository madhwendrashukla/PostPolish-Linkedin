'use client';

import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Globe,
  MoreHorizontal,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';
import { UserPersona } from '@/lib/drafts/types';

interface LinkedInCardProps {
  formattedText: string;
  persona: UserPersona;
  onPersonaChange: (updated: UserPersona) => void;
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  previewTheme: 'light' | 'dark';
  onPreviewThemeChange: (theme: 'light' | 'dark') => void;
}

export const LinkedInCard: React.FC<LinkedInCardProps> = ({
  formattedText,
  persona,
  onPersonaChange,
  previewMode,
  onPreviewModeChange,
  previewTheme,
  onPreviewThemeChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingPersona, setIsEditingPersona] = useState(false);

  // Split text for see-more simulation
  // LinkedIn feed truncates after approximately 3-4 lines or ~210 characters on desktop (fewer on mobile)
  const cutoffLimit = previewMode === 'mobile' ? 140 : 210;
  const isLongPost = formattedText.length > cutoffLimit || formattedText.split('\n').length > 3;

  let aboveTheFold = formattedText;
  let belowTheFold = '';

  if (isLongPost) {
    // Find cut point near cutoffLimit without breaking words if possible
    let cutIdx = cutoffLimit;
    const newlineCut = formattedText.split('\n').slice(0, 3).join('\n');
    if (newlineCut.length < cutoffLimit && newlineCut.length > 50) {
      cutIdx = newlineCut.length;
    }
    aboveTheFold = formattedText.slice(0, cutIdx);
    belowTheFold = formattedText.slice(cutIdx);
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      {/* Preview Control Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-paper)]/50 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text-primary)]">Feed Preview</span>
          <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
            (Simulates actual LinkedIn feed rendering)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Persona Edit Toggle */}
          <button
            type="button"
            onClick={() => setIsEditingPersona(!isEditingPersona)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              isEditingPersona
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="Edit author name and headline"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Desktop / Mobile Switcher */}
          <div className="flex items-center bg-[var(--bg-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => onPreviewModeChange('desktop')}
              className={`p-1.5 rounded-md transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Desktop Feed View (550px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onPreviewModeChange('mobile')}
              className={`p-1.5 rounded-md transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Mobile Feed View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preview Theme Light/Dark */}
          <div className="flex items-center bg-[var(--bg-subtle)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => onPreviewThemeChange('light')}
              className={`p-1.5 rounded-md transition-colors ${
                previewTheme === 'light'
                  ? 'bg-[var(--bg-surface)] text-amber-600 shadow-xs'
                  : 'text-[var(--text-muted)]'
              }`}
              title="LinkedIn Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onPreviewThemeChange('dark')}
              className={`p-1.5 rounded-md transition-colors ${
                previewTheme === 'dark'
                  ? 'bg-[var(--bg-surface)] text-sky-400 shadow-xs'
                  : 'text-[var(--text-muted)]'
              }`}
              title="LinkedIn Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editable Persona Panel if open */}
      {isEditingPersona && (
        <div className="p-3 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] text-xs flex flex-wrap gap-2.5 items-center animate-in slide-in-from-top-2">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-0.5">
              Author Name
            </label>
            <input
              type="text"
              value={persona.name}
              onChange={(e) => onPersonaChange({ ...persona, name: e.target.value })}
              className="w-full px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs"
            />
          </div>
          <div className="flex-2 min-w-[200px]">
            <label className="block text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-0.5">
              Headline
            </label>
            <input
              type="text"
              value={persona.headline}
              onChange={(e) => onPersonaChange({ ...persona, headline: e.target.value })}
              className="w-full px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs"
            />
          </div>
        </div>
      )}

      {/* Preview Card Canvas */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex justify-center items-start bg-[var(--bg-subtle)]/40">
        <div
          className={`w-full transition-all duration-300 rounded-xl shadow-md border ${
            previewTheme === 'dark'
              ? 'bg-[#1b1f23] text-[#e1e9ee] border-[#2f353d]'
              : 'bg-white text-[#191919] border-[#e0e0e0]'
          } ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[550px]'}`}
        >
          {/* Post Header */}
          <div className="p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-xs">
                {persona.name ? persona.name.charAt(0).toUpperCase() : 'A'}
              </div>

              {/* Author Metadata */}
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-sm hover:underline cursor-pointer truncate">
                    {persona.name || 'Author Name'}
                  </span>
                  <span
                    className={`text-[11px] font-normal ${
                      previewTheme === 'dark' ? 'text-[#9fa8b3]' : 'text-[#666666]'
                    }`}
                  >
                    • {persona.connectionDegree}
                  </span>
                </div>
                <div
                  className={`text-[12px] truncate ${
                    previewTheme === 'dark' ? 'text-[#9fa8b3]' : 'text-[#666666]'
                  }`}
                >
                  {persona.headline || 'Headline'}
                </div>
                <div
                  className={`text-[11px] flex items-center gap-1 mt-0.5 ${
                    previewTheme === 'dark' ? 'text-[#9fa8b3]' : 'text-[#666666]'
                  }`}
                >
                  <span>{persona.timeAgo}</span>
                  <span>•</span>
                  <Globe className="w-3 h-3 inline" />
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 ${
                previewTheme === 'dark' ? 'text-[#9fa8b3]' : 'text-[#666666]'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-3.5 pb-3 text-[14px] leading-[1.45] linkedin-font">
            {formattedText ? (
              <div>
                {isCollapsed && isLongPost ? (
                  <div>
                    <span>{aboveTheFold}</span>
                    <button
                      type="button"
                      onClick={() => setIsCollapsed(false)}
                      className="ml-1 text-[var(--text-muted)] hover:underline font-semibold cursor-pointer"
                    >
                      ...see more
                    </button>
                  </div>
                ) : (
                  <div>
                    {isLongPost && (
                      <div className="relative">
                        <span>{aboveTheFold}</span>
                        {/* Visual Fold Indicator */}
                        <div className="my-2 py-1 px-2.5 rounded bg-amber-500/10 border border-dashed border-amber-500/40 text-[11px] font-mono text-amber-600 dark:text-amber-400 flex items-center justify-between select-none">
                          <span>─── Fold Line (~210 chars / "...see more") ───</span>
                          <button
                            type="button"
                            onClick={() => setIsCollapsed(true)}
                            className="underline font-sans font-semibold hover:text-amber-700"
                          >
                            Simulate Fold
                          </button>
                        </div>
                        <span>{belowTheFold}</span>
                      </div>
                    )}
                    {!isLongPost && <span>{formattedText}</span>}
                  </div>
                )}
              </div>
            ) : (
              <span className="italic opacity-40">Your formatted post preview will render here in real time...</span>
            )}
          </div>

          {/* Social Stats */}
          <div
            className={`px-3.5 py-2 flex items-center justify-between text-[12px] border-t ${
              previewTheme === 'dark'
                ? 'border-[#2f353d] text-[#9fa8b3]'
                : 'border-[#e8e8e8] text-[#666666]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="flex -space-x-1">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px]">
                  👍
                </span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px]">
                  ❤️
                </span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[9px]">
                  💡
                </span>
              </span>
              <span>184</span>
            </div>
            <div className="flex items-center gap-2">
              <span>32 comments</span>
              <span>•</span>
              <span>9 reposts</span>
            </div>
          </div>

          {/* Social Action Buttons */}
          <div
            className={`px-2 py-1 flex items-center justify-around border-t text-[13px] font-semibold ${
              previewTheme === 'dark'
                ? 'border-[#2f353d] text-[#c7d1db]'
                : 'border-[#e8e8e8] text-[#5e5e5e]'
            }`}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 py-2 px-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Like</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 py-2 px-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comment</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 py-2 px-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Repeat2 className="w-4 h-4" />
              <span>Repost</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 py-2 px-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
