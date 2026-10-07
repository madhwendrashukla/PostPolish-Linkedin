'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Search,
  Pin,
  Trash2,
  Copy,
  Download,
  Upload,
  FileText,
  Clock,
} from 'lucide-react';
import { PostDraft, DraftsState } from '@/lib/drafts/types';
import { exportDraftsToJson, importDraftsFromJson } from '@/lib/drafts/store';

interface DraftsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: DraftsState;
  onSelectDraft: (id: string) => void;
  onCreateDraft: () => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (id: string) => void;
  onTogglePinDraft: (id: string) => void;
  onImportDrafts: (importedState: DraftsState) => void;
}

export const DraftsDrawer: React.FC<DraftsDrawerProps> = ({
  isOpen,
  onClose,
  state,
  onSelectDraft,
  onCreateDraft,
  onDeleteDraft,
  onDuplicateDraft,
  onTogglePinDraft,
  onImportDrafts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredDrafts = state.drafts.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort pinned drafts first, then latest updated
  const sortedDrafts = [...filteredDrafts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importDraftsFromJson(file);
      onImportDrafts(imported);
    } catch (err) {
      alert('Failed to import drafts: Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-[var(--bg-surface)] h-full shadow-2xl flex flex-col border-l border-[var(--border-subtle)] animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Saved Drafts
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] font-medium">
              {state.drafts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and New Draft Action */}
        <div className="p-4 border-b border-[var(--border-subtle)] space-y-3">
          <button
            onClick={() => {
              onCreateDraft();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Draft</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)] border border-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sortedDrafts.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)] text-sm">
              No drafts found.
            </div>
          ) : (
            sortedDrafts.map((draft) => {
              const isActive = draft.id === state.activeDraftId;
              const dateStr = new Date(draft.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={draft.id}
                  onClick={() => {
                    onSelectDraft(draft.id);
                    onClose();
                  }}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isActive
                      ? 'border-[var(--accent)] bg-[var(--accent-subtle)]/40 shadow-xs'
                      : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]/50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      {draft.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-[var(--accent)] fill-[var(--accent)] shrink-0" />
                      )}
                      <span className="font-semibold text-sm text-[var(--text-primary)] truncate">
                        {draft.title || 'Untitled Draft'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onTogglePinDraft(draft.id)}
                      className={`p-1.5 rounded-lg text-xs hover:bg-[var(--bg-subtle)] transition-colors ${
                        draft.isPinned ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                      }`}
                      title={draft.isPinned ? 'Unpin draft' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateDraft(draft.id)}
                      className="p-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                      title="Duplicate draft"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {state.drafts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteDraft(draft.id)}
                        className="p-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Backup & Restore */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-paper)]/40 flex items-center justify-between gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-secondary)] transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup</span>
          </button>

          <button
            type="button"
            onClick={() => exportDraftsToJson(state)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-secondary)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
