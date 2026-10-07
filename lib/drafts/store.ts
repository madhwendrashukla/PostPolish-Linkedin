import { PostDraft, DraftsState, UserPersona } from './types';
import { BulletStyle, TiptapNode } from '../unicode/converter';

const STORAGE_KEY = 'postpolish_state_v1';

export const EMPTY_INITIAL_DOC: TiptapNode = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

export const DEFAULT_INITIAL_DOC = EMPTY_INITIAL_DOC;

export const DEFAULT_PERSONA: UserPersona = {
  name: 'Alex Rivera',
  headline: 'Founder @ Stealth • Helping founders tell compelling stories on LinkedIn',
  connectionDegree: '1st',
  timeAgo: 'Just now',
};

export const DEFAULT_INITIAL_DRAFT: PostDraft = {
  id: 'draft-1',
  title: 'Untitled Post',
  content: EMPTY_INITIAL_DOC,
  bulletStyle: 'bullet',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isPinned: false,
};

export const INITIAL_STATE: DraftsState = {
  version: 2,
  activeDraftId: 'draft-1',
  drafts: [DEFAULT_INITIAL_DRAFT],
  persona: DEFAULT_PERSONA,
  previewMode: 'desktop',
  previewTheme: 'light',
};

export function loadStoredState(): DraftsState {
  if (typeof window === 'undefined') return INITIAL_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as DraftsState;
    if (!parsed.drafts || parsed.drafts.length === 0) {
      return INITIAL_STATE;
    }
    // If version 1 had the default welcome guide, clear it so user opens with a clean slate
    if (!parsed.version || parsed.version < 2) {
      if (parsed.drafts.length === 1 && parsed.drafts[0].id === 'draft-welcome') {
        return INITIAL_STATE;
      }
    }
    return {
      ...INITIAL_STATE,
      ...parsed,
      version: 2,
      drafts: parsed.drafts.map((d) => ({
        ...d,
        bulletStyle: d.bulletStyle || 'bullet',
      })),
    };
  } catch (err) {
    console.error('Failed to load drafts from storage:', err);
    return INITIAL_STATE;
  }
}

export function saveStoredState(state: DraftsState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save drafts to storage:', err);
  }
}

export function exportDraftsToJson(state: DraftsState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `postpolish-drafts-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDraftsFromJson(file: File): Promise<DraftsState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as DraftsState;
        if (!parsed.drafts || !Array.isArray(parsed.drafts)) {
          throw new Error('Invalid draft file format');
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
