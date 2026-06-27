import React, { useState, useCallback } from 'react';
import { Badge } from '@vscp/ui';
import { CheckSquare, Plus, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paperclipApi } from '../api/services';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

interface Task {
  id: string;
  title: string;
  assignee: { name: string; avatar: string };
  priority: 'P0' | 'P1' | 'P2';
  goalAncestry: string;
  createdAt: string;
  column: string;
}

const columns = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'] as const;

const priorityVariant: Record<string, 'danger' | 'warning' | 'info'> = {
  P0: 'danger',
  P1: 'warning',
  P2: 'info',
};

const columnDot: Record<string, string> = {
  Backlog: 'bg-fg-muted',
  Todo: 'bg-accent',
  'In Progress': 'bg-warning',
  Review: 'bg-info',
  Done: 'bg-success',
};

const initialTasks: Task[] = [
  { id: '1', title: 'Define pricing tiers', assignee: { name: 'Alice Chen', avatar: 'AC' }, priority: 'P1', goalAncestry: 'Mission → Growth → Pricing', createdAt: 'Jun 20', column: 'Backlog' },
  { id: '2', title: 'Write API documentation', assignee: { name: 'Bob Rivera', avatar: 'BR' }, priority: 'P2', goalAncestry: 'Mission → Developer Experience', createdAt: 'Jun 18', column: 'Backlog' },
  { id: '3', title: 'Set up monitoring', assignee: { name: 'Carol Wu', avatar: 'CW' }, priority: 'P1', goalAncestry: 'Mission → Infrastructure → Observability', createdAt: 'Jun 15', column: 'Backlog' },
  { id: '4', title: 'Build revenue calculator', assignee: { name: 'Dan Park', avatar: 'DP' }, priority: 'P0', goalAncestry: 'Mission → Finance → Revenue', createdAt: 'Jun 19', column: 'Todo' },
  { id: '5', title: 'Create competitor analysis', assignee: { name: 'Eve Santos', avatar: 'ES' }, priority: 'P1', goalAncestry: 'Mission → Growth → Market Intel', createdAt: 'Jun 17', column: 'Todo' },
  { id: '6', title: 'Implement JWT auth', assignee: { name: 'Alice Chen', avatar: 'AC' }, priority: 'P0', goalAncestry: 'Mission → Auth → JWT', createdAt: 'Jun 14', column: 'In Progress' },
  { id: '7', title: 'Design dashboard UI', assignee: { name: 'Frank Lee', avatar: 'FL' }, priority: 'P1', goalAncestry: 'Mission → Product → Dashboard', createdAt: 'Jun 16', column: 'In Progress' },
  { id: '8', title: 'Database schema design', assignee: { name: 'Carol Wu', avatar: 'CW' }, priority: 'P0', goalAncestry: 'Mission → Infrastructure → Data Model', createdAt: 'Jun 12', column: 'Review' },
  { id: '9', title: 'Project scaffolding', assignee: { name: 'Bob Rivera', avatar: 'BR' }, priority: 'P1', goalAncestry: 'Mission → Infrastructure → Foundation', createdAt: 'Jun 10', column: 'Done' },
  { id: '10', title: 'CI/CD pipeline', assignee: { name: 'Dan Park', avatar: 'DP' }, priority: 'P0', goalAncestry: 'Mission → Infrastructure → DevOps', createdAt: 'Jun 11', column: 'Done' },
];

export function TasksPage() {
  const queryClient = useQueryClient();
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);

  const { data: tasksData } = useQuery({
    queryKey: ['paperclip', 'tasks', 'default'],
    queryFn: () => paperclipApi.getTasks('default'),
    retry: 0,
    staleTime: 30_000,
  });

  const tasks: Task[] = Array.isArray(tasksData)
    ? (tasksData as Task[]).map((t) => ({
        id: t.id ?? String(Math.random()),
        title: t.title ?? '',
        assignee: t.assignee ?? { name: 'Unassigned', avatar: 'UN' },
        priority: t.priority ?? 'P1',
        goalAncestry: t.goalAncestry ?? '',
        createdAt: t.createdAt ?? '',
        column: t.column ?? 'Backlog',
      }))
    : localTasks;

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      paperclipApi.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paperclip', 'tasks', 'default'] });
    },
  });

  const handleMove = useCallback((itemId: string, toColumn: string) => {
    // Update locally for instant feedback
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === itemId ? { ...t, column: toColumn } : t)),
    );
    // Also fire API call (best-effort)
    updateStatusMutation.mutate({ taskId: itemId, status: toColumn });
  }, [updateStatusMutation]);

  const { getCardProps, getColumnProps, isDragging } = useDragAndDrop(tasks, handleMove);

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <CheckSquare size={20} className="text-primary" />
          <h1 className="text-xl font-bold font-display">Tasks</h1>
          <Badge variant="info">{tasks.length} tasks</Badge>
          {isDragging && <span className="text-[10px] text-accent animate-pulse">Moving task...</span>}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-elevated border border-border hover:border-border-hover text-fg-secondary">
            <Filter size={14} />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-primary text-fg-inverse hover:bg-primary-dark">
            <Plus size={14} />
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col);
          const columnProps = getColumnProps(col);
          return (
            <div
              key={col}
              className="min-w-[280px] w-[280px] shrink-0 flex flex-col rounded-md bg-surface/70 backdrop-blur-md border border-border transition-colors"
              {...(columnProps as React.HTMLAttributes<HTMLDivElement>)}
            >
              {/* Column Header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${columnDot[col]}`} />
                  <span className="text-sm font-semibold">{col}</span>
                  <Badge variant="neutral">{colTasks.length}</Badge>
                </div>
                <button className="text-fg-muted hover:text-fg-secondary">
                  <Plus size={14} />
                </button>
              </div>

              {/* Task Cards */}
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                {colTasks.map((task) => {
                  const cardProps = getCardProps(task.id);
                  return (
                    <div
                      key={task.id}
                      className="bg-elevated/60 border border-border hover:border-border-hover rounded-md p-3 transition-colors duration-fast"
                      {...(cardProps as React.HTMLAttributes<HTMLDivElement>)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Badge variant={priorityVariant[task.priority]} pill>
                          {task.priority}
                        </Badge>
                        <span className="text-sm font-semibold leading-tight">
                          {task.title}
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted mb-2.5">
                        {task.goalAncestry}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[9px] font-bold text-fg-inverse">
                            {task.assignee.avatar}
                          </div>
                          <span className="text-xs text-fg-secondary">
                            {task.assignee.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-fg-dim">
                          {task.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
