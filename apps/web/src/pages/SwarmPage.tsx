import React, { useState, useCallback } from 'react';
import { Badge } from '@vscp/ui';
import { Bug, Plus, Zap, Play, Pause, Terminal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { paperclipApi } from '../api/services';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

// ─── Types ───────────────────────────────────────────────────────────────────

type ColumnId = 'backlog' | 'in-progress' | 'review' | 'done';

interface KanbanTask {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeInColumn: string;
  column: ColumnId;
}

interface WorkerAgent {
  id: string;
  name: string;
  adapter: 'hermes' | 'claude' | 'codex' | 'kimi';
  status: 'active' | 'thinking' | 'blocked' | 'paused';
  activeTask: string;
  budget: { limit: number; spent: number };
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

const INITIAL_TASKS: KanbanTask[] = [
  { id: 't1', title: 'Implement OAuth2 flow', assignedTo: 'hermes', priority: 'high', timeInColumn: '2h 15m', column: 'in-progress' },
  { id: 't2', title: 'Design landing page', assignedTo: 'kimi', priority: 'medium', timeInColumn: '4h 30m', column: 'in-progress' },
  { id: 't3', title: 'Write API integration tests', assignedTo: 'claude', priority: 'high', timeInColumn: '1h 10m', column: 'review' },
  { id: 't4', title: 'Setup CI/CD pipeline', assignedTo: 'hermes', priority: 'critical', timeInColumn: '30m', column: 'backlog' },
  { id: 't5', title: 'Database migration scripts', assignedTo: 'codex', priority: 'medium', timeInColumn: '6h', column: 'in-progress' },
  { id: 't6', title: 'User profile CRUD endpoints', assignedTo: 'claude', priority: 'high', timeInColumn: '1d 2h', column: 'done' },
  { id: 't7', title: 'Error handling middleware', assignedTo: 'hermes', priority: 'low', timeInColumn: '45m', column: 'backlog' },
  { id: 't8', title: 'Rate limiter implementation', assignedTo: 'codex', priority: 'medium', timeInColumn: '3h', column: 'review' },
  { id: 't9', title: 'WebSocket event system', assignedTo: 'kimi', priority: 'high', timeInColumn: '20m', column: 'backlog' },
  { id: 't10', title: 'Auth token refresh logic', assignedTo: 'hermes', priority: 'critical', timeInColumn: '5h', column: 'done' },
  { id: 't11', title: 'Dashboard metrics API', assignedTo: 'claude', priority: 'low', timeInColumn: '2d', column: 'done' },
];

const DEMO_WORKERS: WorkerAgent[] = [
  { id: 'w1', name: 'hermes', adapter: 'hermes', status: 'active', activeTask: 'Implement OAuth2 flow', budget: { limit: 60, spent: 22 } },
  { id: 'w2', name: 'claude', adapter: 'claude', status: 'active', activeTask: 'Write API integration tests', budget: { limit: 50, spent: 14 } },
  { id: 'w3', name: 'kimi', adapter: 'kimi', status: 'thinking', activeTask: 'Design landing page', budget: { limit: 30, spent: 18 } },
  { id: 'w4', name: 'codex', adapter: 'codex', status: 'blocked', activeTask: 'Database migration scripts', budget: { limit: 20, spent: 17 } },
];

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusDot: Record<string, string> = {
  active: 'bg-primary',
  thinking: 'bg-warning',
  blocked: 'bg-error',
  paused: 'bg-fg-muted',
};

const priorityVariant: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
};

const columnAccent: Record<ColumnId, string> = {
  backlog: 'text-fg-muted',
  'in-progress': 'text-primary',
  review: 'text-warning',
  done: 'text-success',
};

// ─── Kanban Card (draggable) ─────────────────────────────────────────────────

function KanbanCard({ task, dragProps }: { task: KanbanTask; dragProps: Record<string, unknown> }) {
  return (
    <div
      className="bg-hover/40 border border-border rounded-md p-3 hover:border-border-hover transition-colors"
      {...(dragProps as React.HTMLAttributes<HTMLDivElement>)}
    >
      <p className="text-xs font-medium text-fg leading-snug">{task.title}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-fg-muted">@{task.assignedTo}</span>
        <span className="text-[10px] text-fg-muted font-mono">{task.timeInColumn}</span>
      </div>
    </div>
  );
}

// ─── Worker Card ─────────────────────────────────────────────────────────────

function WorkerCard({ agent }: { agent: WorkerAgent }) {
  const pct = Math.round((agent.budget.spent / agent.budget.limit) * 100);
  return (
    <div className="bg-hover/40 border border-border rounded-md p-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-xs font-bold font-mono uppercase text-fg-muted border border-border">
          {agent.name.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-fg">{agent.name}</span>
            <span className={`w-2 h-2 rounded-full ${statusDot[agent.status]}`} />
          </div>
          <span className="text-[10px] text-fg-muted font-mono">{agent.adapter}</span>
        </div>
        <div className="flex gap-1">
          <button className="p-1 rounded hover:bg-hover/60 text-fg-muted hover:text-fg transition-colors">
            <Play size={12} />
          </button>
          <button className="p-1 rounded hover:bg-hover/60 text-fg-muted hover:text-fg transition-colors">
            <Pause size={12} />
          </button>
        </div>
      </div>
      <p className="text-xs text-fg-secondary truncate mb-2">
        <span className="text-fg-muted">Task:</span> {agent.activeTask}
      </p>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-fg-muted">Budget</span>
          <span className="text-[10px] text-fg-muted font-mono">
            ${agent.budget.spent} / ${agent.budget.limit}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-hover">
          <div
            className={`h-full rounded-full transition-all ${pct >= 85 ? 'bg-error' : pct >= 60 ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Swarm Page ──────────────────────────────────────────────────────────────

export function SwarmPage() {
  const { data: agentsData } = useQuery({
    queryKey: ['paperclip', 'agents', 'default'],
    queryFn: () => paperclipApi.getAgents('default'),
    retry: 0,
    staleTime: 30_000,
  });

  const { data: tasksData } = useQuery({
    queryKey: ['paperclip', 'tasks', 'default'],
    queryFn: () => paperclipApi.getTasks('default'),
    retry: 0,
    staleTime: 30_000,
  });

  const workers: WorkerAgent[] = Array.isArray(agentsData)
    ? (agentsData as WorkerAgent[]).map((a) => ({
        id: a.id ?? String(Math.random()),
        name: a.name ?? 'unknown',
        adapter: a.adapter ?? 'hermes',
        status: a.status ?? 'active',
        activeTask: a.activeTask ?? '',
        budget: a.budget ?? { limit: 0, spent: 0 },
      }))
    : DEMO_WORKERS;

  const apiTasks: KanbanTask[] = Array.isArray(tasksData)
    ? (tasksData as KanbanTask[]).map((t) => ({
        id: t.id ?? String(Math.random()),
        title: t.title ?? '',
        assignedTo: t.assignedTo ?? '',
        priority: t.priority ?? 'medium',
        timeInColumn: t.timeInColumn ?? '',
        column: t.column ?? 'backlog',
      }))
    : INITIAL_TASKS;

  const [tasks, setTasks] = useState<KanbanTask[]>(apiTasks);

  const handleMove = useCallback((itemId: string, toColumn: string, _toIndex: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === itemId ? { ...t, column: toColumn as ColumnId, timeInColumn: '0m' } : t,
      ),
    );
  }, []);

  const { getCardProps, getColumnProps, isDragging } = useDragAndDrop(tasks, handleMove);

  const tasksByColumn = (col: ColumnId) => tasks.filter((t) => t.column === col);

  return (
    <div className="p-6 h-full overflow-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bug size={20} className="text-primary" />
          <h1 className="text-xl font-bold font-display">Swarm</h1>
          <Badge variant="info">{workers.length} agents</Badge>
          {isDragging && <span className="text-[10px] text-accent animate-pulse">Dragging...</span>}
        </div>
        <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors flex items-center gap-1.5">
          <Plus size={14} /> Dispatch Task
        </button>
      </div>

      {/* ── Content Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
        {/* ── Kanban Board (left 60%) ───────────────────────────────────── */}
        <div className="col-span-7 bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 flex items-center gap-2">
            <Zap size={14} className="text-accent" />
            <h2 className="font-semibold text-sm">Task Board</h2>
          </div>
          <div className="grid grid-cols-4 divide-x divide-border">
            {COLUMNS.map((col) => {
              const colTasks = tasksByColumn(col.id);
              const columnProps = getColumnProps(col.id);
              return (
                <div
                  key={col.id}
                  className="p-3 min-h-[320px] transition-colors"
                  {...(columnProps as React.HTMLAttributes<HTMLDivElement>)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${columnAccent[col.id]}`}>
                      {col.label}
                    </span>
                    <span className="text-[10px] text-fg-muted font-mono bg-hover/60 px-1.5 py-0.5 rounded">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <KanbanCard key={task.id} task={task} dragProps={getCardProps(task.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Worker Agents (right 40%) ─────────────────────────────────── */}
        <div className="col-span-5 bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Terminal size={14} className="text-success" /> Worker Agents
            </h2>
            <span className="text-[10px] text-fg-muted font-mono">
              {workers.filter((a) => a.status === 'active').length} active
            </span>
          </div>
          <div className="p-3 space-y-3">
            {workers.map((agent) => (
              <WorkerCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
