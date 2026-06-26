import React, { useState } from 'react';
import { Badge } from '@vscp/ui';
import { Brain, Search, GitBranch, FileText, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

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

const typeColors: Record<string, string> = {
  decision: 'text-accent', plan: 'text-primary', audit: 'text-error',
  assumption: 'text-warning', fact: 'text-info',
};

export function BrainPage() {
  const [query, setQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const isTech = user?.role === 'admin' || user?.role === 'technical_founder';

  const filteredPages = DEMO_PAGES.filter((p) => {
    if (!isTech && p.scope === 'technical') return false;
    if (query) {
      const q = query.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
    }
    return true;
  });

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain size={20} className="text-accent" />
          <h1 className="text-xl font-bold">Company Brain</h1>
          <Badge variant="info">{filteredPages.length} pages</Badge>
        </div>
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search knowledge..."
            className="w-full pl-10 pr-4 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-5rem)]">
        <div className="col-span-4 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-elevated/60">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <GitBranch size={14} className="text-primary" /> Knowledge Graph
            </h2>
          </div>
          <svg className="w-full h-[calc(100%-3rem)]">
            {DEMO_EDGES.map((edge, i) => {
              const from = DEMO_GRAPH_NODES.find((n) => n.id === edge.from)!;
              const to = DEMO_GRAPH_NODES.find((n) => n.id === edge.to)!;
              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#1a1f2e" strokeWidth="2" />;
            })}
            {DEMO_GRAPH_NODES.map((node) => {
              const isSelected = selectedPage === node.id;
              return (
                <g key={node.id} onClick={() => setSelectedPage(node.id)} className="cursor-pointer">
                  <circle cx={node.x} cy={node.y} r={isSelected ? 20 : 16} fill={isSelected ? '#12a594' : '#141c28'} stroke={isSelected ? '#12a594' : '#1a1f2e'} strokeWidth="2" />
                  <text x={node.x} y={node.y + 28} textAnchor="middle" fill="#9aa4b2" fontSize="10" fontFamily="Satoshi, system-ui">{node.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="col-span-8 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
          <div className="divide-y divide-border">
            {filteredPages.map((page) => (
              <div key={page.id} onClick={() => setSelectedPage(page.id)} className={`px-4 py-3 hover:bg-hover/30 cursor-pointer ${selectedPage === page.id ? 'bg-primary-muted/30' : ''}`}>
                <div className="flex items-start gap-2">
                  <FileText size={14} className={typeColors[page.type] || 'text-fg-muted'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{page.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="neutral">{page.type}</Badge>
                      <Badge variant="info">{page.source}</Badge>
                      <span className="text-[10px] text-fg-muted">{(page.confidence * 100).toFixed(0)}% confidence</span>
                      <span className="text-[10px] text-fg-muted">{page.recency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
