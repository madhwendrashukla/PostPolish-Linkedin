'use client';

import React from 'react';
import { X, Info, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[var(--teal)]" />
            <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              LinkedIn Formatting & Accessibility Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-[var(--text-secondary)] overflow-y-auto leading-relaxed">
          <div className="p-3 rounded-xl bg-[var(--teal-subtle)]/40 border border-[var(--teal)]/20 text-[var(--text-primary)]">
            <h3 className="font-semibold text-sm mb-1 text-[var(--teal)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              How LinkedIn "Formatting" Actually Works
            </h3>
            <p>
              LinkedIn does not support native HTML markup or rich-text tags. Formatting is achieved by swapping standard letters with look-alike characters from the <strong>Unicode Mathematical Alphanumeric Symbols</strong> block (e.g. 𝐛𝐨𝐥𝐝, 𝘪𝘵𝘢𝘭𝘪𝘤).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Best Practices for Maximum Reach
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Use bold/italic for key emphasis:</strong> Ideal for hooks, subtitles, and key takeaway words.
              </li>
              <li>
                <strong>Keep body paragraphs plain:</strong> Entire posts in styled Unicode can reduce readability on smaller screens.
              </li>
              <li>
                <strong>Hashtags and mentions are preserved:</strong> PostPolish automatically protects <code>#hashtags</code>, <code>@mentions</code>, and <code>URLs</code> so your tags and links never break.
              </li>
              <li>
                <strong>Non-Latin languages:</strong> Hindi, Arabic, Chinese, and other scripts remain untouched rather than corrupted.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Accessibility & Screen Reader Note
            </h4>
            <p>
              Screen readers read mathematical Unicode characters literally (e.g., "Mathematical Bold Capital H, Mathematical Bold Small e..."). Keep styled passages selective so assistive technologies can easily digest your posts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-paper)]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
