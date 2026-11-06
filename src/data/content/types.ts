export type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] };
