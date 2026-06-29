import type { CreatePageInput, CaptureInput, PageType, Scope, Confidence } from './schemas.js';
export interface KnowledgePage {
    id: string;
    title: string;
    content: string;
    type: PageType;
    tags: string[];
    scope: Scope[];
    confidence: Confidence;
    references: string[];
    author: string;
    source?: string;
    createdAt: string;
    updatedAt: string;
}
export interface GraphEdge {
    from: string;
    to: string;
    label: string;
}
export interface GraphData {
    nodes: {
        id: string;
        label: string;
        type: PageType;
    }[];
    edges: GraphEdge[];
}
export declare class GbrainStore {
    pages: Map<string, KnowledgePage>;
    graphEdges: GraphEdge[];
    createPage(data: CreatePageInput): KnowledgePage;
    getPage(id: string): KnowledgePage | undefined;
    listPages(): KnowledgePage[];
    queryPages(query: string): KnowledgePage[];
    getGraph(): GraphData;
    rebuildEdges(): void;
    addCapture(data: CaptureInput): KnowledgePage;
    getScopedResults(pages: KnowledgePage[], role?: 'domain_expert' | 'technical_founder'): KnowledgePage[];
    seed(): void;
}
export declare const store: GbrainStore;
//# sourceMappingURL=store.d.ts.map