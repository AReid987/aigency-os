import React, { useState } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { Badge } from '@aigency-os/ui';
import { Brain, Search, GitBranch, FileText, ChevronRight, Shield, Eye, EyeOff } from 'lucide-react';

const DEMO_PAGES = [
  { id: 'p1', title: 'Pricing Decision: $49/mo Pro Tier', type: 'decision', source: 'bmad', confidence: 0.92, recency: '2 days ago', tags: ['pricing', 'revenue'], scope: 'business' },
  { id: 'p2', title: 'Auth System Architecture Plan', type: 'plan', source: 'paul', confidence: 0.88, recency: '1 week ago', tags: ['auth', 'architecture'], scope: 'technical' },
  { id: 'p3', title: 'Security Audit: JWT Token Handling', type: 'audit', source: 'aegis', confidence: 0.95, recency: '3 days ago', tags: ['security', 'jwt'], scope: 'technical' },
  { id: 'p4', title: 'Market Assumption: AI Note-taking TAM', type: 'assumption', source: 'bmad', confidence: 0.65, recency: '1 week ago', tags: ['market', 'tam'], scope: 'business' },
  { id: 'p5', title: 'Sprint 1 Foundation Complete', type: 'fact', source: 'hcom', confidence: 1.0, recency: '2 weeks ago', tags: ['sprint', 'milestone'], scope: 'business' },
];

const DEMO_GRAPH_NODES = [
  { id: 'p1', label: 'Pricing Decision', x: 200, y: 150 },
  { id: 'p2', label: 'Auth Architecture', x: 400, y: 100 },
  { id: 'p3', label: 'Security Audit', x: 350, y: 250 },
  { id: 'p4', label: 'Market Assumption', x: 150, y: 300 },
  { id: 'p5', label: 'Sprint 1 Complete', x: 500, y: 200 },
];

const DEMO_EDGES = [
  { from: 'p3', to: 'p2' },
  { from: 'p1', to: 'p4' },
  { from: 'p5', to: 'p2' },
];

const typeColors: Record<string, string> = {
  decision: 'text-accent', plan: 'text-primary', audit: 'text-error',
  assumption: 'text-warning', fact: 'text-info', transcript: 'text-fg-muted',
};

export default function App() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'domain_expert' | 'technical_founder'>('technical_founder');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const filteredPages = DEMO_PAGES.filter((p) => {
    if (role === 'domain_expert' && p.scope === 'technical') return false;
    if (query) {
      const q = query.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
    }
    return true;
  });

  return (
    <div className="relative min-h-screen text-fg z-10">
      <Atmosphere />
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-md border-b border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain size={20} className="text-accent" />
          <h1 className="text-lg font-bold">Gbrain Knowledge</h1>
          <Badge variant="info">{DEMO_PAGES.length} pages</Badge>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRole(role === 'domain_expert' ? 'technical_founder' : 'domain_expert')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-elevated/70 border border-border hover:bg-hover/60 transition-colors"
          >
            {role === 'domain_expert' ? <Eye size={12} /> : <EyeOff size={12} />}
            {role === 'domain_expert' ? 'Business Only' : 'Full Access'}
          </button>
        </div>
      </header>

      <main className="pt-16 p-6">
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the company..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Knowledge Graph */}
          <div className="col-span-5 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-elevated/60">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <GitBranch size={14} className="text-primary" />
                Knowledge Graph
              </h2>
            </div>
            <div className="relative h-[calc(100%-3rem)]">
              <svg className="w-full h-full">
                {/* Edges */}
                {DEMO_EDGES.map((edge, i) => {
                  const from = DEMO_GRAPH_NODES.find((n) => n.id === edge.from)!;
                  const to = DEMO_GRAPH_NODES.find((n) => n.id === edge.to)!;
                  return (
                    <line
                      key={i}
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke="#1a1f2e" strokeWidth="2"
                    />
                  );
                })}
                {/* Nodes */}
                {DEMO_GRAPH_NODES.map((node) => {
                  const page = DEMO_PAGES.find((p) => p.id === node.id)!;
                  const isSelected = selectedPage === node.id;
                  return (
                    <g key={node.id} onClick={() => setSelectedPage(node.id)} className="cursor-pointer">
                      <circle
                        cx={node.x} cy={node.y} r={isSelected ? 24 : 20}
                        fill={isSelected ? '#12a594' : '#141c28'}
                        stroke={isSelected ? '#12a594' : '#1a1f2e'}
                        strokeWidth="2"
                      />
                      <text
                        x={node.x} y={node.y + 32}
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
          </div>

          {/* Pages list */}
          <div className="col-span-7 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
            <div className="px-4 py-3 border-b border-border bg-elevated/60 sticky top-0">
              <h2 className="font-semibold text-sm">Knowledge Pages</h2>
            </div>
            <div className="divide-y divide-border">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`px-4 py-3 hover:bg-hover/30 cursor-pointer transition-colors ${
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
                        <span className="text-[10px] text-fg-muted">Confidence: {(page.confidence * 100).toFixed(0)}%</span>
                        <span className="text-[10px] text-fg-muted">{page.recency}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {page.tags.map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-hover/60 text-fg-muted">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPages.length === 0 && (
                <div className="p-8 text-center text-fg-muted text-sm">
                  No pages match your query or role scope.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
