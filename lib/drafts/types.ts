import { TiptapNode, BulletStyle } from '../unicode/converter';

export interface UserPersona {
  name: string;
  headline: string;
  avatarUrl?: string;
  connectionDegree: '1st' | '2nd' | '3rd' | 'Following';
  timeAgo: string;
}

export interface PostDraft {
  id: string;
  title: string;
  content: TiptapNode;
  bulletStyle: BulletStyle;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export interface DraftsState {
  version: number;
  activeDraftId: string;
  drafts: PostDraft[];
  persona: UserPersona;
  previewMode: 'desktop' | 'mobile';
  previewTheme: 'light' | 'dark';
}
