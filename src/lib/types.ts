export type GearKey = 'weapon' | 'head' | 'body' | 'hands' | 'legs' | 'feet' | 'ear' | 'neck' | 'wrist' | 'ring';

export interface GearStatus {
  id: number;
  fullName: string;
  gear: Record<GearKey, boolean>;
}

export type BlogArticle = {
  id?: string;
  title: string;
  content: string;
  author_name: string;
  created_at?: string;
}

export type MemoArticle = {
  id?: string;
  title: string;
  content: string;
  author_name: string;
  created_at?: string;
}
