'use client';

import React, { useState } from 'react';
import { X, Wand2, ArrowRight, Copy, Check } from 'lucide-react';
import { unstyleText } from '@/lib/unicode/unstyle';

interface UnstyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyUnstyled: (cleanText: string) => void;
}

export const UnstyleModal: React.FC<UnstyleModalProps> = ({
  isOpen,
  onClose,
  onApplyUnstyled,
}) => {
  const [inputStyled, setInputStyled] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cleanText = unstyleText(inputStyled);

  const handleCopyClean = () => {
    if (!cleanText) return;
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[var(--accent)]" />
            <div>
              <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                Unstyle & Clean Unicode Post
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Paste an already styled LinkedIn post to strip Unicode bold/italic/underline into clean plain text.
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

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Paste Styled Text Here:
            </label>
            <textarea
              rows={4}
              value={inputStyled}
              onChange={(e) => setInputStyled(e.target.value)}
              placeholder="e.g. 𝐇𝐞𝐥𝐥𝐨 𝐰𝐨𝐫𝐥𝐝! 𝐓𝐡𝐢𝐬 𝐢𝐬 𝐛𝐨𝐥𝐝 𝐚𝐧𝐝 𝘪𝘵𝘢𝘭𝘪𝘤..."
              className="w-full p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Cleaned Plain Text Output:
            </label>
            <textarea
              rows={4}
              readOnly
              value={cleanText}
              placeholder="Clean plain text will appear here..."
              className="w-full p-3 rounded-xl bg-[var(--bg-paper)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-paper)]/40 flex items-center justify-end gap-2.5">
          <button
            onClick={handleCopyClean}
            disabled={!cleanText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-secondary)] disabled:opacity-40 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Clean Text'}</span>
          </button>

          <button
            onClick={() => {
              if (!cleanText) return;
              onApplyUnstyled(cleanText);
              onClose();
            }}
            disabled={!cleanText}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold shadow-sm disabled:opacity-40 transition-all"
          >
            <span>Insert into Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
