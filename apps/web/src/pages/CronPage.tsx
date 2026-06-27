import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import { Clock, Play, Pause, Trash2, Zap, Plus, X } from 'lucide-react';
import { paperclipApi } from '../api/services';

interface CronJob {
  id: number;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused';
  agent: string;
}

const demoJobs: CronJob[] = [
  { id: 1, name: 'Heartbeat: All Agents', schedule: '0 */8 * * *', lastRun: '3h ago', nextRun: '5h from now', status: 'active', agent: 'hermes' },
  { id: 2, name: 'Market Monitor', schedule: '0 9 * * 1', lastRun: '5d ago', nextRun: '2d from now', status: 'active', agent: 'claude' },
  { id: 3, name: 'Budget Alert Check', schedule: '0 */4 * * *', lastRun: '1h ago', nextRun: '3h from now', status: 'active', agent: 'kimi' },
  { id: 4, name: 'CRM Lead Enrichment', schedule: '0 10 * * 1-5', lastRun: '18h ago', nextRun: '6h from now', status: 'paused', agent: 'codex' },
];

const statusVariant: Record<string, 'success' | 'warning'> = {
  active: 'success',
  paused: 'warning',
};

export function CronPage() {
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState(demoJobs);

  // Fetch heartbeats from Paperclip API
  useQuery({
    queryKey: ['paperclip', 'heartbeats', 'default'],
    queryFn: () =>
      paperclipApi.getHeartbeats('default').then((r) => {
        const heartbeats = r as unknown as Record<string, unknown>[];
        if (heartbeats && heartbeats.length > 0) {
          setJobs(
            heartbeats.map((hb, i) => ({
              id: Number(hb.id ?? i),
              name: String(hb.name ?? hb.type ?? `Job ${i + 1}`),
              schedule: String(hb.schedule ?? hb.cron ?? '—'),
              lastRun: hb.lastRun ? String(hb.lastRun) : '—',
              nextRun: hb.nextRun ? String(hb.nextRun) : '—',
              status: (hb.status === 'paused' ? 'paused' : 'active') as 'active' | 'paused',
              agent: String(hb.agent ?? '—'),
            }))
          );
        }
        return heartbeats;
      }),
    staleTime: 30_000,
  });

  const toggleJob = (id: number) => {
    setJobs(jobs.map((j) => j.id === id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j));
  };

  const deleteJob = (id: number) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface/70 backdrop-blur-md rounded-md border border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-fg" />
          <h2 className="text-lg font-semibold text-fg">Scheduled Jobs</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-elevated/60 border border-border rounded-md text-fg text-sm hover:bg-elevated transition-colors"
        >
          <Plus size={14} />
          New Job
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-elevated/60 text-fg-muted text-left">
              <th className="px-4 py-2.5 font-medium">Job Name</th>
              <th className="px-4 py-2.5 font-medium">Schedule</th>
              <th className="px-4 py-2.5 font-medium">Last Run</th>
              <th className="px-4 py-2.5 font-medium">Next Run</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Agent</th>
              <th className="px-4 py-2.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-elevated/30 transition-colors">
                <td className="px-4 py-2.5 text-fg font-medium">{job.name}</td>
                <td className="px-4 py-2.5">
                  <code className="text-xs bg-elevated/60 px-1.5 py-0.5 rounded text-fg-muted">{job.schedule}</code>
                </td>
                <td className="px-4 py-2.5 text-fg-muted">
                  <span className="flex items-center gap-1.5"><Clock size={12} />{job.lastRun}</span>
                </td>
                <td className="px-4 py-2.5 text-fg-muted">{job.nextRun}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                </td>
                <td className="px-4 py-2.5 text-fg capitalize">{job.agent}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="p-1.5 rounded hover:bg-elevated/60 text-fg-muted hover:text-fg transition-colors"
                      title={job.status === 'active' ? 'Pause' : 'Resume'}
                    >
                      {job.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-elevated/60 text-fg-muted hover:text-fg transition-colors"
                      title="Run now"
                    >
                      <Zap size={14} />
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="p-1.5 rounded hover:bg-elevated/60 text-fg-muted hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface/95 backdrop-blur-md rounded-lg border border-border w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-fg">New Scheduled Job</h3>
              <button onClick={() => setShowModal(false)} className="text-fg-muted hover:text-fg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-fg-muted mb-1">Job Name</label>
                <input className="w-full bg-elevated/60 border border-border rounded-md px-3 py-2 text-fg text-sm focus:outline-none focus:border-fg-muted" placeholder="e.g. Daily Report" />
              </div>
              <div>
                <label className="block text-sm text-fg-muted mb-1">Schedule (cron expression)</label>
                <input className="w-full bg-elevated/60 border border-border rounded-md px-3 py-2 text-fg text-sm font-mono focus:outline-none focus:border-fg-muted" placeholder="0 9 * * *" />
              </div>
              <div>
                <label className="block text-sm text-fg-muted mb-1">Agent</label>
                <select className="w-full bg-elevated/60 border border-border rounded-md px-3 py-2 text-fg text-sm focus:outline-none focus:border-fg-muted">
                  <option>hermes</option>
                  <option>claude</option>
                  <option>kimi</option>
                  <option>codex</option>
                  <option>qwen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-fg-muted mb-1">Prompt / Script</label>
                <textarea className="w-full bg-elevated/60 border border-border rounded-md px-3 py-2 text-fg text-sm font-mono h-24 resize-none focus:outline-none focus:border-fg-muted" placeholder="Enter the prompt or script to run..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-fg-muted hover:text-fg transition-colors">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-elevated/60 border border-border rounded-md text-fg text-sm hover:bg-elevated transition-colors">Create Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
