'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Minus,
  RotateCcw,
  RotateCw,
  Sparkles,
  Smile,
  Trash2,
  ChevronDown,
  RemoveFormatting,
} from 'lucide-react';
import { BulletStyle, TiptapNode } from '@/lib/unicode/converter';

interface PostEditorProps {
  initialContent: TiptapNode;
  bulletStyle: BulletStyle;
  onBulletStyleChange: (style: BulletStyle) => void;
  onChange: (doc: TiptapNode) => void;
  onClear: () => void;
}

const COMMON_EMOJIS = [
  '👉', '👇', '💡', '🚀', '🔥', '✨', '📌', '🎯', '📈', '🧵',
  '✅', '❌', '🧠', '💼', '💪', '🙌', '🤝', '⚡', '📊', '💬'
];

const BULLET_CHOICES: { label: string; style: BulletStyle; symbol: string }[] = [
  { label: 'Classic Bullet', style: 'bullet', symbol: '•' },
  { label: 'Dash Line', style: 'dash', symbol: '–' },
  { label: 'Clean Arrow', style: 'arrow', symbol: '→' },
  { label: 'Checkmark', style: 'check', symbol: '✓' },
];

export const PostEditor: React.FC<PostEditorProps> = ({
  initialContent,
  bulletStyle,
  onBulletStyleChange,
  onChange,
  onClear,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const bulletRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Write your hook here... (e.g. 3 lessons I learned scaling to 10k users)',
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
    ],
    content: initialContent as any,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as TiptapNode);
    },
  });

  // Sync content when active draft changes externally
  useEffect(() => {
    if (editor && initialContent) {
      const currentJson = JSON.stringify(editor.getJSON());
      const nextJson = JSON.stringify(initialContent);
      if (currentJson !== nextJson) {
        editor.commands.setContent(initialContent as any);
      }
    }
  }, [initialContent, editor]);

  // Handle clicking outside popovers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (bulletRef.current && !bulletRef.current.contains(e.target as Node)) {
        setShowBulletMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      {/* Editor Fixed Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-paper)]/50">
        {/* Style Buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg text-sm font-semibold transition-colors ${
              editor.isActive('bold')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-bold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg text-sm transition-colors ${
              editor.isActive('italic')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-lg text-sm transition-colors ${
              editor.isActive('underline')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg text-sm transition-colors ${
              editor.isActive('strike')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* Monospace / Code */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded-lg text-sm transition-colors ${
              editor.isActive('code')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="Monospace (Code)"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

          {/* Bullet List Selector with Marker Choices */}
          <div className="relative" ref={bulletRef}>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-l-lg text-sm transition-colors ${
                  editor.isActive('bulletList')
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowBulletMenu(!showBulletMenu)}
                className="p-2 -ml-1 rounded-r-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                title="Change bullet marker style"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {showBulletMenu && (
              <div className="absolute left-0 mt-1 z-40 w-44 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] shadow-lg p-1 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-semibold text-[var(--text-muted)] px-2.5 py-1">
                  Bullet Style
                </div>
                {BULLET_CHOICES.map((choice) => (
                  <button
                    key={choice.style}
                    type="button"
                    onClick={() => {
                      onBulletStyleChange(choice.style);
                      setShowBulletMenu(false);
                      if (!editor.isActive('bulletList')) {
                        editor.chain().focus().toggleBulletList().run();
                      }
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      bulletStyle === choice.style
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{choice.label}</span>
                    <span className="font-bold text-sm text-[var(--accent)]">{choice.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg text-sm transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Divider Line */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
            title="Insert Divider"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Emoji Popover */}
          <div className="relative" ref={emojiRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
              title="Insert Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute left-0 mt-1 z-40 w-56 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] shadow-xl p-2 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1 px-1">
                  Popular Creator Emojis
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="p-1.5 text-lg rounded-lg hover:bg-[var(--bg-subtle)] transition-transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
            title="Clear Formatting on Selection"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Undo, Redo, Reset */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Clear All Text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Main Writing Area */}
      <div className="flex-1 p-5 sm:p-7 overflow-y-auto cursor-text bg-[var(--bg-surface)]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
