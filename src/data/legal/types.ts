import type { ContentBlock } from '../content/types';

export interface LegalTable {
  caption: string;
  columns: string[];
  rows: string[][];
}

export type LegalBlock =
  | ContentBlock
  | { kind: 'table'; table: LegalTable };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  description: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}
