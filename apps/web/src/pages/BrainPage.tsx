import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import {
  Brain, Search, GitBranch, FileText, Plus, X, Loader2,
} from 'lucide-react';
import { gbrainApi } from '../api/services';
import { useAuthStore } from '../stores/authStore';

// ─── Demo fallback data ──────────────────────────────────────────────────────

const DEMO_PAGES = [
  { id: 'p1', title: 'Pricing Decision: $49/mo Pro Tier', type: 'decision', source: 'bmad', confidence: 0.92, recency: '2 days ago', tags: ['pricing', 'revenue'], scope: 'business' },
  { id: 'p2', title: 'Auth System Architecture Plan', type: 'plan', source: 'paul', confidence: 0.88, recency: '1 week ago', tags: ['auth', 'architecture'], scope: 'technical' },
  { id: 'p3', title: 'Security Audit: JWT Token Handling', type: 'audit', source: 'aegis', confidence: 0.95, recency: '3 days ago', tags: ['security', 'jwt'], scope: 'technical' },
  { id: 'p4', title: 'Market Assumption: AI Note-taking TAM', type: 'assumption', source: 'bmad', confidence: 0.65, recency: '1 week ago', tags: ['market', 'tam'], scope: 'business' },
  { id: 'p5', title: 'Sprint 1 Foundation Complete', type: 'fact', source: 'hcom', confidence: 1.0, recency: '2 weeks ago', tags: ['sprint', 'milestone'], scope: 'business' },
];

const DEMO_GRAPH_NODES = [
  { id: 'p1', label: 'Pricing', x: 150, y: 120 },
  { id: 'p2', label: 'Auth', x: 350, y: 80 },
  { id: 'p3', label: 'Security', x: 300, y: 220 },
  { id: 'p4', label: 'Market', x: 100, y: 250 },
  { id: 'p5', label: 'Sprint 1', x: 450, y: 180 },
];

const DEMO_EDGES = [
  { from: 'p3', to: 'p2' },
  { from: 'p1', to: 'p4' },
  { from: 'p5', to: 'p2' },
];

// ─── Type & source helpers ───────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  decision: 'text-accent',
  plan: 'text-primary',
  audit: 'text-error',
  assumption: 'text-warning',
  fact: 'text-info',
};

const SOURCE_FILTERS = ['all', 'paperclip', 'hcom', 'aegis', 'plannotator', 'bmad'] as const;

// ─── Debounce hook ───────────────────────────────────────────────────────────

function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── Capture Form ────────────────────────────────────────────────────────────

function CaptureForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('fact');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const mutation = useMutation({
    mutationFn: (data: { title: string; type: string; content: string; tags: string[] }) =>
      gbrainApi.createPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gbrain', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['gbrain', 'graph'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title,
      type,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-surface border border-border rounded-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus size={16} className="text-accent" /> Capture Knowledge
          </h3>
          <button type="button" onClick={onClose} className="text-fg-muted hover:text-fg">
            <X size={16} />
          </button>
        </div>

        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
        >
          <option value="fact">Fact</option>
          <option value="decision">Decision</option>
          <option value="plan">Plan</option>
          <option value="assumption">Assumption</option>
          <option value="audit">Audit</option>
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content / notes..."
          rows={4}
          className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none resize-none"
        />

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
        />

        <div className="flex items-center gap-2 justify-end">
          {mutation.isError && (
            <span className="text-xs text-error flex-1">Failed to save — try again</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-fg-muted border border-border rounded-md hover:bg-hover/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || !title.trim()}
            className="px-4 py-2 text-xs text-white bg-primary rounded-md hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5"
          >
            {mutation.isPending && <Loader2 size={12} className="animate-spin" />}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main BrainPage ──────────────────────────────────────────────────────────

interface BrainPageItem {
  id: string;
  title: string;
  type: string;
  source: string;
  confidence: number;
  recency: string;
  tags: string[];
  scope: string;
}

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

export function BrainPage() {
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [showCapture, setShowCapture] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isTech = user?.role === 'admin' || user?.role === 'technical_founder';
  const debouncedQuery = useDebounced(query, 300);

  // ── Data fetching ────────────────────────────────────────────────────────

  const { data: pagesData, isLoading: pagesLoading } = useQuery({
    queryKey: ['gbrain', 'pages', sourceFilter === 'all' ? undefined : sourceFilter],
    queryFn: () => gbrainApi.getPages(sourceFilter === 'all' ? undefined : { source: sourceFilter }),
    retry: false,
  });

  const { data: graphData } = useQuery({
    queryKey: ['gbrain', 'graph'],
    queryFn: () => gbrainApi.getGraph(),
    retry: false,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['gbrain', 'search', debouncedQuery, user?.role],
    queryFn: () => gbrainApi.search(debouncedQuery, user?.role),
    enabled: debouncedQuery.length > 1,
    retry: false,
  });

  // ── Resolve pages (API → demo fallback) ──────────────────────────────────

  const apiPages: BrainPageItem[] = useMemo(() => {
    if (searchData && Array.isArray(searchData.results) && searchData.results.length > 0) {
      return searchData.results as BrainPageItem[];
    }
    if (pagesData && Array.isArray(pagesData.pages) && pagesData.pages.length > 0) {
      return pagesData.pages as BrainPageItem[];
    }
    return DEMO_PAGES;
  }, [pagesData, searchData]);

  const graphNodes: GraphNode[] = useMemo(
    () => (Array.isArray(graphData?.nodes) && graphData!.nodes.length > 0
      ? (graphData!.nodes as GraphNode[])
      : DEMO_GRAPH_NODES),
    [graphData],
  );

  const graphEdges: GraphEdge[] = useMemo(
    () => (Array.isArray(graphData?.edges) && graphData!.edges.length > 0
      ? (graphData!.edges as GraphEdge[])
      : DEMO_EDGES),
    [graphData],
  );

  // ── Filtering (client-side scope + local text search when no API search) ──

  const filteredPages = useMemo(() => {
    return apiPages.filter((p) => {
      // Role-based scope filter
      if (!isTech && p.scope === 'technical') return false;
      // Source filter (already handled server-side for API, but needed for demo fallback)
      if (sourceFilter !== 'all' && p.source !== sourceFilter) return false;
      // Local text search when no debounced query
      if (!debouncedQuery) return true;
      const q = debouncedQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.type.includes(q)
      );
    });
  }, [apiPages, isTech, sourceFilter, debouncedQuery]);

  // ── Graph node click ─────────────────────────────────────────────────────

  const handleNodeClick = useCallback((id: string) => {
    setSelectedPage(id);
    const el = document.getElementById(`page-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain size={20} className="text-accent" />
          <h1 className="text-xl font-bold">Company Brain</h1>
          <Badge variant="info">{filteredPages.length} pages</Badge>
          {pagesLoading && <Loader2 size={14} className="animate-spin text-fg-muted" />}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search knowledge..."
              className="w-full pl-10 pr-4 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            />
            {searchLoading && (
              <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-fg-muted" />
            )}
          </div>
          <button
            onClick={() => setShowCapture(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
          >
            <Plus size={14} /> Capture
          </button>
        </div>
      </div>

      {/* Source filters */}
      <div className="flex items-center gap-1.5 mb-4">
        {SOURCE_FILTERS.map((src) => (
          <button
            key={src}
            onClick={() => setSourceFilter(src)}
            className={`px-3 py-1 text-[11px] rounded-full border transition-colors ${
              sourceFilter === src
                ? 'bg-primary text-white border-primary'
                : 'border-border text-fg-muted hover:border-border-hover hover:text-fg'
            }`}
          >
            {src}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Knowledge graph */}
        <div className="col-span-4 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-elevated/60">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <GitBranch size={14} className="text-primary" /> Knowledge Graph
            </h2>
          </div>
          <svg className="w-full h-[calc(100%-3rem)]">
            {graphEdges.map((edge, i) => {
              const from = graphNodes.find((n) => n.id === edge.from);
              const to = graphNodes.find((n) => n.id === edge.to);
              if (!from || !to) return null;
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#1a1f2e"
                  strokeWidth="2"
                />
              );
            })}
            {graphNodes.map((node) => {
              const isSelected = selectedPage === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 20 : 16}
                    fill={isSelected ? '#12a594' : '#141c28'}
                    stroke={isSelected ? '#12a594' : '#1a1f2e'}
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y + 28}
                    textAnchor="middle"
                    fill="#9aa4b2"
                    fontSize="10"
                    fontFamily="Satoshi, system-ui"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Page list */}
        <div className="col-span-8 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
          {filteredPages.length === 0 && !pagesLoading ? (
            <div className="flex items-center justify-center h-full text-fg-muted text-sm">
              No pages found
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  id={`page-${page.id}`}
                  onClick={() => setSelectedPage(page.id)}
                  className={`px-4 py-3 hover:bg-hover/30 cursor-pointer ${
                    selectedPage === page.id ? 'bg-primary-muted/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileText size={14} className={typeColors[page.type] || 'text-fg-muted'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{page.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="neutral">{page.type}</Badge>
                        <Badge variant="info">{page.source}</Badge>
                        <span className="text-[10px] text-fg-muted">
                          {(page.confidence * 100).toFixed(0)}% confidence
                        </span>
                        <span className="text-[10px] text-fg-muted">{page.recency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Capture modal */}
      {showCapture && <CaptureForm onClose={() => setShowCapture(false)} />}
    </div>
  );
}
