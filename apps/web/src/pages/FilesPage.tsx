import React, { useState } from 'react';
import {
  FolderOpen, File, FileText, FileCode,
  ChevronRight, ChevronDown, Search, Folder, X, Trash2,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  icon?: React.ElementType;
  children?: FileNode[];
  size?: string;
  modified?: string;
  expanded?: boolean;
  path?: string;
}

// ─── Demo File Contents ──────────────────────────────────────────────────────

const FILE_CONTENTS: Record<string, { content: string; language: string }> = {
  'src/components/App.tsx': {
    content: [
      "import React from 'react';",
      "import { BrowserRouter, Routes, Route } from 'react-router-dom';",
      "import { OfficePage } from './pages/OfficePage';",
      '',
      'export default function App() {',
      '  return (',
      '    <BrowserRouter>',
      '      <Routes>',
      '        <Route path="/" element={<OfficePage />} />',
      '      </Routes>',
      '    </BrowserRouter>',
      '  );',
      '}',
    ].join('\n'),
    language: 'tsx',
  },
  'src/components/Sidebar.tsx': {
    content: [
      "import React from 'react';",
      "import { NavLink } from 'react-router-dom';",
      "import { Layout, Bug, Users, Brain, BarChart } from 'lucide-react';",
      '',
      'const NAV_ITEMS = [',
      "  { path: '/', label: 'Office', icon: Layout },",
      "  { path: '/swarm', label: 'Swarm', icon: Bug },",
      "  { path: '/orchestrator', label: 'Orchestrator', icon: Users },",
      "  { path: '/brain', label: 'Brain', icon: Brain },",
      "  { path: '/crm', label: 'CRM', icon: BarChart },",
      '];',
      '',
      'export function Sidebar() {',
      '  return (',
      '    <nav className="w-56 bg-surface border-r border-border flex flex-col">',
      '      <div className="p-4 font-bold font-display text-primary">Aigency</div>',
      '      {NAV_ITEMS.map(item => (',
      '        <NavLink key={item.path} to={item.path}>',
      '          <item.icon size={16} />',
      '          {item.label}',
      '        </NavLink>',
      '      ))}',
      '    </nav>',
      '  );',
      '}',
    ].join('\n'),
    language: 'tsx',
  },
  'src/components/Canvas.tsx': {
    content: [
      "import React, { useRef, useEffect, useState } from 'react';",
      "import { useCanvasStore } from '../stores/canvasStore';",
      '',
      'export function Canvas() {',
      "  const canvasRef = useRef<HTMLCanvasElement>(null);",
      '  const { zones, cards, transform } = useCanvasStore();',
      '  const [isDragging, setIsDragging] = useState(false);',
      '',
      '  useEffect(() => {',
      '    const canvas = canvasRef.current;',
      '    if (!canvas) return;',
      "    const ctx = canvas.getContext('2d');",
      '    if (!ctx) return;',
      '',
      '    ctx.clearRect(0, 0, canvas.width, canvas.height);',
      '    ctx.save();',
      '    ctx.translate(transform.x, transform.y);',
      '    ctx.scale(transform.zoom, transform.zoom);',
      '',
      '    // Draw zones',
      '    zones.forEach(zone => {',
      "      ctx.fillStyle = zone.color + '20';",
      '      ctx.strokeStyle = zone.color;',
      '      ctx.fillRect(zone.x, zone.y, zone.width, zone.height);',
      '      ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);',
      '    });',
      '',
      '    // Draw cards',
      '    cards.forEach(card => {',
      "      ctx.fillStyle = '#1a1a2e';",
      '      ctx.fillRect(card.x, card.y, card.width, card.height);',
      "      ctx.fillStyle = '#ffffff';",
      "      ctx.font = '14px Inter';",
      '      ctx.fillText(card.title, card.x + 12, card.y + 24);',
      '    });',
      '',
      '    ctx.restore();',
      '  }, [zones, cards, transform]);',
      '',
      '  return (',
      '    <canvas',
      '      ref={canvasRef}',
      '      className="w-full h-full bg-canvas"',
      '      onMouseDown={() => setIsDragging(true)}',
      '      onMouseUp={() => setIsDragging(false)}',
      '    />',
      '  );',
      '}',
    ].join('\n'),
    language: 'tsx',
  },
  'src/pages/OfficePage.tsx': {
    content: [
      "import React from 'react';",
      "import { Sidebar } from '../components/Sidebar';",
      "import { Canvas } from '../components/Canvas';",
      "import { StatusPanel } from '../components/StatusPanel';",
      '',
      'export function OfficePage() {',
      '  return (',
      '    <div className="flex h-screen">',
      '      <Sidebar />',
      '      <main className="flex-1 relative">',
      '        <Canvas />',
      '        <StatusPanel />',
      '      </main>',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
    language: 'tsx',
  },
  'src/pages/SwarmPage.tsx': {
    content: [
      "import React, { useState } from 'react';",
      "import { Bug, Clock, CheckCircle, AlertCircle } from 'lucide-react';",
      '',
      "type Status = 'todo' | 'in-progress' | 'review' | 'done';",
      '',
      'interface Task {',
      '  id: string;',
      '  title: string;',
      '  assignee: string;',
      '  status: Status;',
      "  priority: 'low' | 'medium' | 'high';",
      '}',
      '',
      'export function SwarmPage() {',
      '  const [tasks, setTasks] = useState<Task[]>([]);',
      '',
      '  const columns = {',
      "    todo: tasks.filter(t => t.status === 'todo'),",
      "    'in-progress': tasks.filter(t => t.status === 'in-progress'),",
      "    review: tasks.filter(t => t.status === 'review'),",
      "    done: tasks.filter(t => t.status === 'done'),",
      '  };',
      '',
      '  return (',
      '    <div className="p-6">',
      '      <h1 className="text-2xl font-bold mb-6">Swarm Board</h1>',
      '      <div className="grid grid-cols-4 gap-4">',
      '        {Object.entries(columns).map(([status, items]) => (',
      '          <div key={status} className="bg-surface rounded-lg p-4">',
      '            <h2 className="font-semibold capitalize mb-3">{status}</h2>',
      '            {items.map(task => (',
      '              <div key={task.id} className="bg-elevated p-3 rounded mb-2">',
      '                <p className="text-sm">{task.title}</p>',
      '                <span className="text-xs text-fg-muted">{task.assignee}</span>',
      '              </div>',
      '            ))}',
      '          </div>',
      '        ))}',
      '      </div>',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
    language: 'tsx',
  },
  'src/pages/OrchestratorPage.tsx': {
    content: [
      "import React from 'react';",
      "import { Users, Plus, Bot } from 'lucide-react';",
      "import { useQuery } from '@tanstack/react-query';",
      "import { paperclipApi } from '../api/services';",
      '',
      'interface Agent {',
      '  id: string;',
      '  name: string;',
      '  role: string;',
      "  status: 'active' | 'idle' | 'offline';",
      '  model: string;',
      '}',
      '',
      'export function OrchestratorPage() {',
      "  const { data: agents = [] } = useQuery({",
      "    queryKey: ['agents'],",
      "    queryFn: () => paperclipApi.getAgents('default'),",
      '  });',
      '',
      '  return (',
      '    <div className="p-6">',
      '      <div className="flex items-center justify-between mb-6">',
      '        <h1 className="text-2xl font-bold">Orchestrator</h1>',
      '        <button className="btn-primary">',
      '          <Plus size={16} /> Hire Agent',
      '        </button>',
      '      </div>',
      '      <div className="grid grid-cols-3 gap-4">',
      '        {agents.map((agent: Agent) => (',
      '          <div key={agent.id} className="bg-surface rounded-lg p-4 border border-border">',
      '            <div className="flex items-center gap-2 mb-2">',
      '              <Bot size={20} className="text-primary" />',
      '              <h3 className="font-semibold">{agent.name}</h3>',
      '            </div>',
      '            <p className="text-sm text-fg-secondary">{agent.role}</p>',
      '            <span className="text-xs text-fg-muted">{agent.model}</span>',
      '          </div>',
      '        ))}',
      '      </div>',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
    language: 'tsx',
  },
  'src/api/services.ts': {
    content: [
      "import { createAPIClient } from '@aigency-os/api-client';",
      '',
      "const PAPERCLIP_URL = import.meta.env.VITE_PAPERCLIP_URL || 'http://localhost:3001';",
      'const paperclipRaw = createAPIClient({ baseUrl: PAPERCLIP_URL });',
      '',
      'export const paperclipApi = {',
      "  getCompanies: () => paperclipRaw.get('/api/v1/companies'),",
      '  getAgents: (id: string) => paperclipRaw.get(`/api/v1/companies/${id}/agents`),',
      '  getTasks: (agentId: string) => paperclipRaw.get(`/api/v1/agents/${agentId}/tasks`),',
      '  createTask: (agentId: string, task: any) =>',
      '    paperclipRaw.post(`/api/v1/agents/${agentId}/tasks`, task),',
      '};',
    ].join('\n'),
    language: 'ts',
  },
  'src/stores/canvasStore.ts': {
    content: [
      "import { create } from 'zustand';",
      "import { subscribeWithSelector } from 'zustand/middleware';",
      '',
      'interface Zone {',
      '  id: string;',
      '  name: string;',
      '  x: number; y: number;',
      '  width: number; height: number;',
      '  color: string;',
      '}',
      '',
      'interface Card {',
      '  id: string;',
      '  title: string;',
      '  x: number; y: number;',
      '  width: number; height: number;',
      '  zoneId?: string;',
      '  data: Record<string, any>;',
      '}',
      '',
      'interface Transform { x: number; y: number; zoom: number; }',
      '',
      'interface CanvasState {',
      '  zones: Zone[];',
      '  cards: Card[];',
      '  transform: Transform;',
      '  selectedId: string | null;',
      '  addZone: (zone: Zone) => void;',
      '  addCard: (card: Card) => void;',
      '  moveCard: (id: string, x: number, y: number) => void;',
      '  setTransform: (t: Partial<Transform>) => void;',
      '  select: (id: string | null) => void;',
      '}',
      '',
      'export const useCanvasStore = create<CanvasState>()(',
      '  subscribeWithSelector((set) => ({',
      '    zones: [],',
      '    cards: [],',
      '    transform: { x: 0, y: 0, zoom: 1 },',
      '    selectedId: null,',
      "    addZone: (zone) => set((s) => ({ zones: [...s.zones, zone] })),",
      "    addCard: (card) => set((s) => ({ cards: [...s.cards, card] })),",
      '    moveCard: (id, x, y) =>',
      '      set((s) => ({',
      '        cards: s.cards.map((c) => (c.id === id ? { ...c, x, y } : c)),',
      '      })),',
      '    setTransform: (t) =>',
      '      set((s) => ({ transform: { ...s.transform, ...t } })),',
      '    select: (id) => set({ selectedId: id }),',
      '  }))',
      ');',
    ].join('\n'),
    language: 'ts',
  },
  'src/stores/authStore.ts': {
    content: [
      "import { create } from 'zustand';",
      "import { persist } from 'zustand/middleware';",
      '',
      'interface User {',
      '  id: string;',
      '  email: string;',
      '  name: string;',
      "  role: 'admin' | 'user' | 'agent';",
      '}',
      '',
      'interface AuthState {',
      '  user: User | null;',
      '  token: string | null;',
      '  isAuthenticated: boolean;',
      '  login: (email: string, password: string) => Promise<void>;',
      '  logout: () => void;',
      '  setToken: (token: string) => void;',
      '}',
      '',
      'export const useAuthStore = create<AuthState>()(',
      '  persist(',
      '    (set) => ({',
      '      user: null,',
      '      token: null,',
      '      isAuthenticated: false,',
      '      login: async (email, password) => {',
      "        const res = await fetch('/api/auth/login', {",
      "          method: 'POST',",
      "          headers: { 'Content-Type': 'application/json' },",
      '          body: JSON.stringify({ email, password }),',
      '        });',
      '        const data = await res.json();',
      '        set({ user: data.user, token: data.token, isAuthenticated: true });',
      '      },',
      "      logout: () => set({ user: null, token: null, isAuthenticated: false }),",
      "      setToken: (token) => set({ token }),",
      '    }),',
      "    { name: 'auth-storage' }",
      '  )',
      ');',
    ].join('\n'),
    language: 'ts',
  },
  'src/stores/userStore.ts': {
    content: [
      "import { create } from 'zustand';",
      '',
      'interface UserPreferences {',
      "  theme: 'dark' | 'light';",
      '  sidebarCollapsed: boolean;',
      '  canvasGridSnap: boolean;',
      '}',
      '',
      'interface UserState {',
      '  preferences: UserPreferences;',
      '  setPreference: <K extends keyof UserPreferences>(',
      '    key: K,',
      '    value: UserPreferences[K]',
      '  ) => void;',
      '}',
      '',
      'export const useUserStore = create<UserState>()((set) => ({',
      '  preferences: {',
      "    theme: 'dark',",
      '    sidebarCollapsed: false,',
      '    canvasGridSnap: true,',
      '  },',
      '  setPreference: (key, value) =>',
      '    set((s) => ({',
      '      preferences: { ...s.preferences, [key]: value },',
      '    })),',
      '}));',
    ].join('\n'),
    language: 'ts',
  },
  'services/paperclip-api/index.ts': {
    content: [
      "import express from 'express';",
      "import cors from 'cors';",
      "import { PrismaClient } from '@prisma/client';",
      '',
      'const app = express();',
      'const prisma = new PrismaClient();',
      '',
      'app.use(cors());',
      'app.use(express.json());',
      '',
      "app.get('/api/v1/companies', async (req, res) => {",
      '  const companies = await prisma.company.findMany({',
      '    include: { agents: true },',
      '  });',
      '  res.json(companies);',
      '});',
      '',
      "app.get('/api/v1/companies/:id/agents', async (req, res) => {",
      '  const agents = await prisma.agent.findMany({',
      "    where: { companyId: req.params.id },",
      '  });',
      '  res.json(agents);',
      '});',
      '',
      'app.listen(3001, () => {',
      "  console.log('Paperclip API running on :3001');",
      '});',
    ].join('\n'),
    language: 'ts',
  },
  'services/denchclaw/index.ts': {
    content: [
      "import { createClient } from 'redis';",
      "import { processMessage } from './handlers';",
      '',
      'const redis = createClient({',
      "  url: process.env.REDIS_URL || 'redis://localhost:6379',",
      '});',
      '',
      'async function startWorker() {',
      '  await redis.connect();',
      "  console.log('Denchclaw worker connected to Redis');",
      '',
      '  while (true) {',
      "    const message = await redis.brPop('agent:tasks', 0);",
      '    if (message) {',
      '      const task = JSON.parse(message.element);',
      '      const result = await processMessage(task);',
      "      await redis.lPush('agent:results', JSON.stringify(result));",
      '    }',
      '  }',
      '}',
      '',
      'startWorker().catch(console.error);',
    ].join('\n'),
    language: 'ts',
  },
  'package.json': {
    content: [
      '{',
      '  "name": "@aigency-os/web",',
      '  "version": "0.2.0",',
      '  "private": true,',
      '  "scripts": {',
      '    "dev": "vite",',
      '    "build": "tsc && vite build",',
      '    "preview": "vite preview"',
      '  },',
      '  "dependencies": {',
      '    "react": "^19.0.0",',
      '    "react-dom": "^19.0.0",',
      '    "react-router-dom": "^7.0.0",',
      '    "zustand": "^5.0.0",',
      '    "@tanstack/react-query": "^5.0.0",',
      '    "lucide-react": "^0.400.0",',
      '    "@aigency-os/ui": "workspace:*",',
      '    "@aigency-os/api-client": "workspace:*"',
      '  },',
      '  "devDependencies": {',
      '    "typescript": "^5.5.0",',
      '    "vite": "^6.0.0",',
      '    "@types/react": "^19.0.0"',
      '  }',
      '}',
    ].join('\n'),
    language: 'json',
  },
  'README.md': {
    content: [
      '# Aigency OS',
      '',
      'AI venture platform with autonomous agent orchestration.',
      '',
      '## Quick Start',
      '',
      '```bash',
      'pnpm install',
      'pnpm dev',
      '```',
      '',
      '## Architecture',
      '',
      '- **Canvas**: Infinite canvas with zones and cards',
      '- **Swarm**: Kanban board for agent task management',
      '- **Orchestrator**: Agent org chart and hiring',
      '- **Brain**: Knowledge graph and search',
      '- **CRM**: Pipeline and contact management',
      '',
      '## Tech Stack',
      '',
      '- React 19 + Vite',
      '- Zustand for state',
      '- TanStack Query for data',
      '- Tailwind CSS for styling',
    ].join('\n'),
    language: 'md',
  },
};

// ─── Demo Tree ───────────────────────────────────────────────────────────────

const DEMO_TREE: FileNode[] = [
  {
    name: 'src', type: 'folder', expanded: true,
    children: [
      {
        name: 'components', type: 'folder', expanded: true,
        children: [
          { name: 'App.tsx', type: 'file', icon: FileCode, size: '8.2 KB', modified: '2h ago', path: 'src/components/App.tsx' },
          { name: 'Sidebar.tsx', type: 'file', icon: FileCode, size: '4.1 KB', modified: '1h ago', path: 'src/components/Sidebar.tsx' },
          { name: 'Canvas.tsx', type: 'file', icon: FileCode, size: '12.5 KB', modified: '3h ago', path: 'src/components/Canvas.tsx' },
        ],
      },
      {
        name: 'pages', type: 'folder',
        children: [
          { name: 'OfficePage.tsx', type: 'file', icon: FileCode, size: '6.8 KB', modified: '30m ago', path: 'src/pages/OfficePage.tsx' },
          { name: 'SwarmPage.tsx', type: 'file', icon: FileCode, size: '5.4 KB', modified: '1h ago', path: 'src/pages/SwarmPage.tsx' },
          { name: 'OrchestratorPage.tsx', type: 'file', icon: FileCode, size: '9.1 KB', modified: '2h ago', path: 'src/pages/OrchestratorPage.tsx' },
        ],
      },
      {
        name: 'api', type: 'folder',
        children: [
          { name: 'services.ts', type: 'file', icon: FileCode, size: '10.2 KB', modified: '45m ago', path: 'src/api/services.ts' },
        ],
      },
      {
        name: 'stores', type: 'folder',
        children: [
          { name: 'canvasStore.ts', type: 'file', icon: FileCode, size: '11.5 KB', modified: '1d ago', path: 'src/stores/canvasStore.ts' },
          { name: 'authStore.ts', type: 'file', icon: FileCode, size: '3.2 KB', modified: '2d ago', path: 'src/stores/authStore.ts' },
          { name: 'userStore.ts', type: 'file', icon: FileCode, size: '2.1 KB', modified: '2d ago', path: 'src/stores/userStore.ts' },
        ],
      },
    ],
  },
  {
    name: 'services', type: 'folder',
    children: [
      { name: 'paperclip-api', type: 'folder', children: [
        { name: 'index.ts', type: 'file', icon: FileCode, size: '2.4 KB', modified: '3d ago', path: 'services/paperclip-api/index.ts' },
      ]},
      { name: 'denchclaw', type: 'folder', children: [
        { name: 'index.ts', type: 'file', icon: FileCode, size: '2.3 KB', modified: '3d ago', path: 'services/denchclaw/index.ts' },
      ]},
    ],
  },
  { name: 'package.json', type: 'file', icon: File, size: '1.8 KB', modified: '1d ago', path: 'package.json' },
  { name: 'README.md', type: 'file', icon: FileText, size: '4.5 KB', modified: '3d ago', path: 'README.md' },
];

// ─── Syntax Highlighting ─────────────────────────────────────────────────────

const KEYWORDS_RE = /\b(import|export|from|default|function|const|let|var|return|if|else|async|await|new|class|extends|interface|type|enum|true|false|null|undefined|typeof|instanceof|throw|try|catch|finally|for|while|do|switch|case|break|continue|as|in|of|void|super|this)\b/g;
const STRINGS_RE = /(['"`])(?:(?!\1|\\).|\\.)*?\1/g;
const COMMENTS_RE = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const NUMBERS_RE = /\b(\d+\.?\d*)\b/g;

function highlightCode(code: string): string {
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const tokens: string[] = [];
  let tokenIndex = 0;

  function tokenize(match: string, className: string): string {
    const placeholder = `\x00${tokenIndex}\x00`;
    tokens.push(`<span class="${className}">${match}</span>`);
    tokenIndex++;
    return placeholder;
  }

  html = html.replace(COMMENTS_RE, (m) => tokenize(m, 'syn-comment'));
  html = html.replace(STRINGS_RE, (m) => tokenize(m, 'syn-string'));
  html = html.replace(NUMBERS_RE, (m) => tokenize(m, 'syn-number'));
  html = html.replace(KEYWORDS_RE, (m) => tokenize(m, 'syn-keyword'));

  for (let i = tokens.length - 1; i >= 0; i--) {
    html = html.replace(`\x00${i}\x00`, tokens[i]);
  }

  return html;
}

// ─── File Tree Item ──────────────────────────────────────────────────────────

function FileTreeItem({
  node,
  depth,
  selectedPath,
  onFileClick,
  onDelete,
}: {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onFileClick: (path: string) => void;
  onDelete: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(node.expanded ?? false);
  const isFolder = node.type === 'folder';
  const Icon = isFolder ? (expanded ? FolderOpen : Folder) : (node.icon || File);
  const isSelected = !isFolder && node.path === selectedPath;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) {
            setExpanded(!expanded);
          } else if (node.path) {
            onFileClick(node.path);
          }
        }}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors group ${
          isSelected
            ? 'bg-primary/15 text-primary'
            : isFolder
              ? 'font-medium hover:bg-hover/30'
              : 'text-fg-secondary hover:bg-hover/30'
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {isFolder ? (
          expanded ? <ChevronDown size={12} className="text-fg-muted" /> : <ChevronRight size={12} className="text-fg-muted" />
        ) : (
          <span className="w-3" />
        )}
        <Icon size={14} className={isFolder ? 'text-amber' : isSelected ? 'text-primary' : 'text-fg-muted'} />
        <span className="flex-1 text-left truncate">{node.name}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.name);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              onDelete(node.name);
            }
          }}
          className="p-0.5 rounded text-fg-muted hover:text-error hover:bg-error-muted/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title={`Delete ${node.name}`}
        >
          <Trash2 size={12} />
        </span>
      </button>
      {isFolder && expanded && node.children?.map((child) => (
        <FileTreeItem
          key={child.name}
          node={child}
          depth={depth + 1}
          selectedPath={selectedPath}
          onFileClick={onFileClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ─── Code Viewer ─────────────────────────────────────────────────────────────

function CodeViewer({ filePath }: { filePath: string }) {
  const fileData = FILE_CONTENTS[filePath];
  if (!fileData) {
    return (
      <div className="flex-1 flex items-center justify-center text-fg-muted text-sm">
        <div className="text-center">
          <FileCode size={32} className="mx-auto mb-2 opacity-40" />
          <p>File not found in demo contents</p>
        </div>
      </div>
    );
  }

  const lines = fileData.content.split('\n');

  return (
    <div className="flex-1 overflow-auto font-mono text-[13px] leading-6">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="hover:bg-hover/20">
              <td className="text-right pr-4 pl-4 select-none text-fg-muted/50 text-[11px] w-12 align-top border-r border-border/30">
                {i + 1}
              </td>
              <td className="pl-4 pr-4 whitespace-pre">
                <span dangerouslySetInnerHTML={{ __html: highlightCode(line) || '&nbsp;' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Files Page ──────────────────────────────────────────────────────────────

export function FilesPage() {
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [fileTree, setFileTree] = useState<FileNode[]>(DEMO_TREE);

  const handleFileClick = (path: string) => {
    setSelectedFile(path);
    if (!openFiles.includes(path)) {
      setOpenFiles((prev) => [...prev, path]);
    }
  };

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFiles((prev) => prev.filter((f) => f !== path));
    if (selectedFile === path) {
      const remaining = openFiles.filter((f) => f !== path);
      setSelectedFile(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  };

  const handleDeleteFile = (name: string) => {
    const removeFromTree = (nodes: FileNode[]): FileNode[] =>
      nodes
        .filter((n) => n.name !== name)
        .map((n) =>
          n.children ? { ...n, children: removeFromTree(n.children) } : n,
        );
    setFileTree((prev) => removeFromTree(prev));
    // Also close any open tab for this file
    const deletedPath = fileTree
      .flatMap(function flatten(n: FileNode): FileNode[] {
        return [n, ...(n.children?.flatMap(flatten) ?? [])];
      })
      .find((n) => n.name === name)?.path;
    if (deletedPath) {
      setOpenFiles((prev) => prev.filter((f) => f !== deletedPath));
      if (selectedFile === deletedPath) {
        setSelectedFile(null);
      }
    }
  };

  const getFileName = (path: string) => path.split('/').pop() || path;

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderOpen size={20} className="text-primary" />
          <h1 className="text-xl font-bold font-display">Files</h1>
        </div>
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-3 py-1.5 bg-elevated/70 border border-border rounded-md text-xs focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex gap-0 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden min-h-0">
        {/* Left Panel - File Tree */}
        <div className="w-[30%] min-w-[200px] border-r border-border flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-elevated/60 text-[10px] text-fg-muted font-semibold uppercase tracking-wider">
            Explorer
          </div>
          <div className="flex-1 overflow-auto">
            {fileTree.map((node) => (
              <FileTreeItem
                key={node.name}
                node={node}
                depth={0}
                selectedPath={selectedFile}
                onFileClick={handleFileClick}
                onDelete={handleDeleteFile}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Code Viewer */}
        <div className="w-[70%] flex flex-col overflow-hidden">
          {/* Tab Bar */}
          {openFiles.length > 0 && (
            <div className="flex items-center border-b border-border bg-elevated/40 overflow-x-auto shrink-0">
              {openFiles.map((path) => {
                const isActive = path === selectedFile;
                return (
                  <button
                    key={path}
                    onClick={() => setSelectedFile(path)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs border-r border-border/50 whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-surface/70 text-fg border-b-2 border-b-primary'
                        : 'text-fg-muted hover:bg-hover/20'
                    }`}
                  >
                    <FileCode size={12} className={isActive ? 'text-primary' : 'text-fg-muted'} />
                    <span>{getFileName(path)}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleCloseTab(path, e)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCloseTab(path, e as unknown as React.MouseEvent)}
                      className="ml-1 p-0.5 rounded hover:bg-hover/40 text-fg-muted hover:text-fg transition-colors cursor-pointer"
                      aria-label={`Close ${getFileName(path)}`}
                    >
                      <X size={10} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Code Content */}
          {selectedFile ? (
            <CodeViewer filePath={selectedFile} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-fg-muted text-sm">
              <div className="text-center">
                <FileCode size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No file selected</p>
                <p className="text-xs mt-1 text-fg-muted/60">Click a file in the explorer to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-3 text-[10px] text-fg-muted">
        <span>25 files, 12 folders</span>
        <span>Total: 156 KB</span>
      </div>

      {/* Syntax highlighting styles */}
      <style>{`
        .syn-keyword { color: #c678dd; font-weight: 500; }
        .syn-string { color: #98c379; }
        .syn-comment { color: #5c6370; font-style: italic; }
        .syn-number { color: #d19a66; }
        .syn-tag { color: #e06c75; }
      `}</style>
    </div>
  );
}
