import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { Badge } from '@vscp/ui';
import { VentureUploadPage } from './VentureUploadPage';
import {
  Lightbulb, ArrowRight, ArrowLeft, CheckCircle, MessageSquare,
  FileText, Send, Cpu, Loader, Zap, Users, Upload,
} from 'lucide-react';
import { paperclipApi } from '../api/services';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'idea' | 'requirements' | 'review' | 'files' | 'goal' | 'launching' | 'launched';

interface Requirement {
  id: string;
  category: string;
  question: string;
  options: string[];
  selected: string;
  custom: string;
}

interface GoalDocument {
  title: string;
  mission: string;
  requirements: Array<{ category: string; decision: string }>;
  createdAt: string;
}

// ─── Requirement Generator ───────────────────────────────────────────────────

function generateRequirements(idea: string): Requirement[] {
  return [
    {
      id: 'target',
      category: 'Target Customer',
      question: `For "${idea.slice(0, 60)}...", who is the primary target customer?`,
      options: [
        'Small businesses (1-50 employees) looking to automate workflows',
        'Enterprise teams (500+) seeking productivity gains',
        'Individual creators and freelancers wanting AI assistance',
      ],
      selected: '',
      custom: '',
    },
    {
      id: 'value',
      category: 'Value Proposition',
      question: 'What is the core value proposition that differentiates this venture?',
      options: [
        'AI-first approach — agents handle the work autonomously',
        'Lower cost than existing solutions with better UX',
        'Unique data or methodology that competitors lack',
      ],
      selected: '',
      custom: '',
    },
    {
      id: 'revenue',
      category: 'Revenue Model',
      question: 'How will this venture generate revenue?',
      options: [
        'Subscription (SaaS) — monthly/annual tiers',
        'Usage-based — pay per action or API call',
        'Freemium — free tier + paid premium features',
      ],
      selected: '',
      custom: '',
    },
    {
      id: 'mvp',
      category: 'MVP Scope',
      question: 'What is the minimum viable product for the first 30 days?',
      options: [
        'Core feature only — one thing done exceptionally well',
        'Full workflow — end-to-end for a single use case',
        'Platform — multi-tenant with API for integrations',
      ],
      selected: '',
      custom: '',
    },
    {
      id: 'risk',
      category: 'Biggest Risk',
      question: 'What is the biggest risk that needs early validation?',
      options: [
        'Market demand — will people actually pay for this?',
        'Technical feasibility — can AI agents deliver quality?',
        'Distribution — how do we reach the first 100 customers?',
      ],
      selected: '',
      custom: '',
    },
    {
      id: 'team',
      category: 'Team Structure',
      question: 'What agent team composition should the CEO assemble first?',
      options: [
        'Technical-heavy: CTO + 2 Engineers + QA',
        'Balanced: CTO + Engineer + CMO + Sales',
        'Growth-first: CMO + Sales + Content + Engineer',
      ],
      selected: '',
      custom: '',
    },
  ];
}

// ─── Chat Bubble Component ───────────────────────────────────────────────────

function Bubble({ role, children }: { role: 'system' | 'user'; children: React.ReactNode }) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
          role === 'user'
            ? 'bg-primary text-fg-inverse'
            : 'bg-surface/70 backdrop-blur-md border border-border'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function VenturePage() {
  const navigate = useNavigate();
  const createZone = useCanvasStore((s) => s.createZone);
  const createCard = useCanvasStore((s) => s.createCard);
  const user = useAuthStore((s) => s.user);

  const [phase, setPhase] = useState<Phase>('idea');
  const [idea, setIdea] = useState('');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [goalDoc, setGoalDoc] = useState<GoalDocument | null>(null);
  const [launchStatus, setLaunchStatus] = useState('');

  // ── Phase 1: Submit idea → generate requirements ─────────────────────────

  const handleIdeaSubmit = () => {
    if (!idea.trim()) return;
    setRequirements(generateRequirements(idea));
    setPhase('requirements');
  };

  // ── Phase 2: Select requirements ─────────────────────────────────────────

  const handleSelect = (reqId: string, option: string) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, selected: option, custom: '' } : r)),
    );
  };

  const handleCustom = (reqId: string, value: string) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, custom: value, selected: 'Other' } : r)),
    );
  };

  const allAnswered = requirements.every((r) => r.selected && (r.selected !== 'Other' || r.custom.trim()));

  // ── Phase 3: Review → generate goal document ─────────────────────────────

  const handleReview = () => {
    const doc: GoalDocument = {
      title: idea.slice(0, 80),
      mission: `Build and launch "${idea.slice(0, 80)}" using an AI-agent team.`,
      requirements: requirements.map((r) => ({
        category: r.category,
        decision: r.selected === 'Other' ? r.custom : r.selected,
      })),
      createdAt: new Date().toISOString(),
    };
    setGoalDoc(doc);
    setPhase('review');
  };

  // ── Phase 4: Approve → create company + hand off to CEO ──────────────────

  const handleApprove = async () => {
    if (!goalDoc) return;
    setPhase('launching');
    setLaunchStatus('Creating venture company...');

    // 1. Create company in Paperclip
    let cId = 'demo-company';
    try {
      const company = await paperclipApi.createCompany({
        name: goalDoc.title,
        mission: goalDoc.mission,
        goal: goalDoc.requirements.map((r) => `${r.category}: ${r.decision}`).join('\n'),
      });
      cId = (company as any)?.id || (company as any)?.companyId || 'demo-company';
    } catch {
      // API unreachable — continue with demo
    }

    // 2. Create CEO agent
    setLaunchStatus('Hiring CEO agent...');
    try {
      await paperclipApi.createAgent(cId, {
        name: 'CEO',
        role: 'CEO',
        adapterType: 'hermes',
        heartbeatSchedule: '*/5 * * * *',
      });
    } catch {
      // Continue
    }

    // 3. Create initial goal
    setLaunchStatus('Handing goal document to CEO...');
    try {
      await paperclipApi.createGoal(cId, {
        title: goalDoc.title,
        description: goalDoc.mission,
        priority: 'P0',
      });
    } catch {
      // Continue
    }

    // 4. Create canvas zone with goal doc
    createZone('business', goalDoc.title, { x: 0, y: 0 });
    const zones = useCanvasStore.getState().zones;
    const newZone = zones[zones.length - 1];

    createCard('bmc', newZone.id, { x: 60, y: 80 }, {
      title: `${goalDoc.title} — Goal Document`,
      partners: '', activities: '', resources: '',
      value: goalDoc.requirements.find((r) => r.category === 'Value Proposition')?.decision || '',
      relationships: '', channels: '',
      segments: goalDoc.requirements.find((r) => r.category === 'Target Customer')?.decision || '',
      cost: '', revenue: goalDoc.requirements.find((r) => r.category === 'Revenue Model')?.decision || '',
    });

    createCard('gate', newZone.id, { x: 60, y: 440 }, {
      title: 'Goal Approved',
      status: 'approved',
      description: `Goal approved by ${user?.name || 'founder'}. CEO agent has received the goal document.`,
      milestone: 'Venture Kickoff',
    });

    setLaunchStatus('CEO has received the goal document and is beginning execution.');
    setPhase('launched');
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb size={24} className="text-amber" />
          <h1 className="text-2xl font-bold font-display">New Venture</h1>
        </div>

        {/* Phase: Idea Input */}
        {phase === 'idea' && (
          <div>
            <Bubble role="system">
              <p className="font-medium mb-1">Describe your venture idea.</p>
              <p className="text-fg-muted">I'll break it into structured requirements with options for each. You pick the best fit or write your own.</p>
            </Bubble>

            <div className="mb-4">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., An AI-powered customer support platform that resolves tickets autonomously..."
                className="w-full h-32 p-4 bg-elevated/70 border border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleIdeaSubmit();
                  }
                }}
              />
            </div>

            <button
              onClick={handleIdeaSubmit}
              disabled={!idea.trim()}
              className="px-5 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={16} /> Analyze Requirements
            </button>
          </div>
        )}

        {/* Phase: Requirements Selection */}
        {phase === 'requirements' && (
          <div>
            <Bubble role="system">
              <p className="font-medium mb-1">Here are the key decisions for your venture.</p>
              <p className="text-fg-muted">Pick the best option for each, or write your own in "Other".</p>
            </Bubble>

            <div className="space-y-6 mb-6">
              {requirements.map((req, i) => (
                <div key={req.id} className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-primary-muted text-primary flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{req.category}</span>
                      <p className="text-sm text-fg mt-0.5">{req.question}</p>
                    </div>
                  </div>

                  <div className="space-y-2 ml-8">
                    {req.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => handleSelect(req.id, opt)}
                        className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors ${
                          req.selected === opt
                            ? 'border-primary bg-primary-muted/30 text-fg'
                            : 'border-border hover:border-border-hover text-fg-secondary'
                        }`}
                      >
                        <span className="font-mono text-xs text-fg-muted mr-2">{String.fromCharCode(65 + j)}.</span>
                        {opt}
                      </button>
                    ))}

                    {/* Other option */}
                    <div
                      className={`rounded-md border transition-colors ${
                        req.selected === 'Other' ? 'border-primary bg-primary-muted/30' : 'border-border'
                      }`}
                    >
                      <button
                        onClick={() => handleSelect(req.id, 'Other')}
                        className="w-full text-left px-3 py-2 text-sm text-fg-secondary"
                      >
                        <span className="font-mono text-xs text-fg-muted mr-2">D.</span>
                        Other
                      </button>
                      {req.selected === 'Other' && (
                        <div className="px-3 pb-2">
                          <input
                            type="text"
                            value={req.custom}
                            onChange={(e) => handleCustom(req.id, e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReview}
                disabled={!allAnswered}
                className="px-5 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowRight size={16} /> Review Decisions
              </button>
              <button
                onClick={() => setPhase('idea')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          </div>
        )}

        {/* Phase: Review */}
        {phase === 'review' && goalDoc && (
          <div>
            <Bubble role="system">
              <p className="font-medium mb-1">Here's your venture plan based on your choices.</p>
              <p className="text-fg-muted">Review your decisions, then continue to upload any supporting files.</p>
            </Bubble>

            <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-5 mb-6">
              <h2 className="text-lg font-bold mb-4">{goalDoc.title}</h2>

              <div className="space-y-4">
                {goalDoc.requirements.map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-muted text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">{r.category}</p>
                      <p className="text-sm text-fg mt-0.5">{r.decision}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('files')}
                className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Upload size={16} /> Continue to File Upload
              </button>
              <button
                onClick={() => setPhase('requirements')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Revise
              </button>
            </div>
          </div>
        )}

        {/* Phase: File Upload */}
        {phase === 'files' && goalDoc && (
          <div>
            <Bubble role="system">
              <p className="font-medium mb-1">Upload supporting files for your venture.</p>
              <p className="text-fg-muted">Add any documents, assets, or reference files that will help the CEO agent get started. This step is optional.</p>
            </Bubble>

            <div className="mb-6">
              <VentureUploadPage ventureName={goalDoc.title} />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('goal')}
                className="px-5 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <ArrowRight size={16} /> Continue to Goal
              </button>
              <button
                onClick={() => setPhase('review')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Review
              </button>
              <button
                onClick={() => setPhase('goal')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg text-sm ml-auto"
              >
                Skip Upload →
              </button>
            </div>
          </div>
        )}

        {/* Phase: Goal Approval */}
        {phase === 'goal' && goalDoc && (
          <div>
            <Bubble role="system">
              <p className="font-medium mb-1">Ready to launch your venture.</p>
              <p className="text-fg-muted">Review your goal document one final time and approve to hand it off to the CEO agent.</p>
            </Bubble>

            <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-5 mb-6">
              <h2 className="text-lg font-bold mb-4">{goalDoc.title}</h2>

              <div className="space-y-3">
                {goalDoc.requirements.map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-muted text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">{r.category}</p>
                      <p className="text-sm text-fg mt-0.5">{r.decision}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 bg-success text-fg-inverse font-semibold rounded-lg hover:bg-success/80 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} /> Approve & Launch
              </button>
              <button
                onClick={() => setPhase('files')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Files
              </button>
            </div>
          </div>
        )}

        {/* Phase: Launching */}
        {phase === 'launching' && (
          <div>
            <Bubble role="system">
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin text-primary" />
                <p>{launchStatus}</p>
              </div>
            </Bubble>

            <div className="flex items-center gap-4 mt-6 text-xs text-fg-muted">
              <div className="flex items-center gap-1.5">
                <Cpu size={14} className="text-primary" /> Creating company
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-accent" /> Hiring CEO
              </div>
              <div className="flex items-center gap-1.5">
                <FileText size={14} className="text-amber" /> Handing off goal
              </div>
            </div>
          </div>
        )}

        {/* Phase: Launched */}
        {phase === 'launched' && goalDoc && (
          <div>
            <Bubble role="system">
              <p className="font-medium mb-2">Venture launched successfully.</p>
              <p className="text-fg-muted">The CEO agent has received the goal document and is assembling the team.</p>
            </Bubble>

            <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-5 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={24} className="text-success" />
                <div>
                  <h2 className="text-lg font-bold">{goalDoc.title}</h2>
                  <p className="text-xs text-fg-muted">Launched {new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <button
                  onClick={() => navigate('/swarm')}
                  className="p-3 rounded-md bg-hover/40 border border-border hover:border-border-hover text-center transition-colors"
                >
                  <Zap size={18} className="mx-auto mb-1 text-primary" />
                  <span className="text-xs font-medium">Swarm</span>
                </button>
                <button
                  onClick={() => navigate('/conductor')}
                  className="p-3 rounded-md bg-hover/40 border border-border hover:border-border-hover text-center transition-colors"
                >
                  <Cpu size={18} className="mx-auto mb-1 text-accent" />
                  <span className="text-xs font-medium">Conductor</span>
                </button>
                <button
                  onClick={() => navigate('/canvas')}
                  className="p-3 rounded-md bg-hover/40 border border-border hover:border-border-hover text-center transition-colors"
                >
                  <FileText size={18} className="mx-auto mb-1 text-amber" />
                  <span className="text-xs font-medium">Canvas</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
