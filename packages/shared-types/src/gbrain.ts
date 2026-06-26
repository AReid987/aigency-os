// ─── GBrain (Knowledge Graph) Types ─────────────────────────────────────────

export type PageType =
  | 'decision'
  | 'plan'
  | 'audit'
  | 'assumption'
  | 'fact'
  | 'transcript';

export type KnowledgeSource =
  | 'paperclip'
  | 'hcom'
  | 'aegis'
  | 'plannotator'
  | 'bmad'
  | 'manual'
  | 'gbrain';

export interface Frontmatter {
  source: string;
  type: PageType;
  confidence: number;
  recency: string;
  tags: string[];
  scope: string;
}

export interface KnowledgePage {
  id: string;
  source: string;
  type: PageType;
  title: string;
  content: string;
  frontmatter: Frontmatter;
  confidence: number;
  recency: string;
  evidenceSources: string[];
  supersedes: string[];
  contradictions: string[];
}

export interface QueryResult {
  page: KnowledgePage;
  score: number;
  snippet: string;
  matchType: 'full' | 'partial' | 'fuzzy';
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  connections: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
