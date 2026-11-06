import type { ContentBlock } from '../content/types';

export interface FaqQuestion {
  id: string;
  question: string;
  blocks: ContentBlock[];
}

export interface FaqDocument {
  title: string;
  description: string;
  intro: string;
  questions: FaqQuestion[];
}
