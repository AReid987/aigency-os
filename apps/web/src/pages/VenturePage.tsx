import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { Badge } from '@vscp/ui';
import { Lightbulb, ArrowRight, ArrowLeft, Loader, CheckCircle, MessageSquare, Users, Briefcase, Cpu, Zap } from 'lucide-react';
import { paperclipApi } from '../api/services';

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 'input' | 'questions' | 'rearticulation' | 'plan' | 'approved' | 'ceo_hiring' | 'team_assembly' | 'execution_started';

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface AgentSpec {
  name: string;
  role: string;
  adapterType: string;
  heartbeatSchedule: string;
  icon: React.ReactNode;
  hired: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PAUL_QUESTIONS: Question[] = [
  { id: 'q1', question: 'Who is the target customer? Describe their demographics, pain points, and current solutions they use.', answer: '' },
  { id: 'q2', question: 'What is the core value proposition? What makes this different from existing solutions?', answer: '' },
  { id: 'q3', question: 'What is the revenue model? (subscription, usage-based, one-time, freemium)', answer: '' },
  { id: 'q4', question: 'What are the key milestones for the first 90 days?', answer: '' },
  { id: 'q5', question: 'What are the biggest risks or assumptions that need validation?', answer: '' },
];

const INITIAL_AGENT_SPECS: AgentSpec[] = [
  { name: 'Atlas', role: 'CTO', adapterType: 'openai', heartbeatSchedule: '*/5 * * * *', icon: <Cpu size={20} className="text-primary" />, hired: false },
  { name: 'Nova', role: 'CMO', adapterType: 'anthropic', heartbeatSchedule: '*/10 * * * *', icon: <Lightbulb size={20} className="text-amber" />, hired: false },
  { name: 'Blitz', role: 'Sales Lead', adapterType: 'openai', heartbeatSchedule: '*/15 * * * *', icon: <Zap size={20} className="text-success" />, hired: false },
  { name: 'Forge', role: 'Engineer', adapterType: 'openai', heartbeatSchedule: '*/5 * * * *', icon: <Cpu size={20} className="text-accent" />, hired: false },
];

const STEP_LABELS = ['Idea', 'Questions', 'Rearticulate', 'Plan', 'Approved', 'CEO Hiring', 'Team Assembly', 'Execution'];
const STEP_KEYS: Step[] = ['input', 'questions', 'rearticulation', 'plan', 'approved', 'ceo_hiring', 'team_assembly', 'execution_started'];

// ─── Component ───────────────────────────────────────────────────────────────

export function VenturePage() {
  const navigate = useNavigate();
  const createZone = useCanvasStore((s) => s.createZone);
  const createCard = useCanvasStore((s) => s.createCard);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState<Step>('input');
  const [idea, setIdea] = useState('');
  const [questions, setQuestions] = useState<Question[]>(PAUL_QUESTIONS);
  const [rearticulation, setRearticulation] = useState('');
  const [plan, setPlan] = useState<{
    title: string;
    tasks: Array<{ title: string; criteria: string[] }>;
    sections: Array<{ title: string; content: string; type: string }>;
  } | null>(null);

  // CEO Hiring state
  const [ceoPhase, setCeoPhase] = useState<'analyzing' | 'summary'>('analyzing');
  const [agentSpecs, setAgentSpecs] = useState<AgentSpec[]>(INITIAL_AGENT_SPECS);
  const [hiringIndex, setHiringIndex] = useState(0);
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Step 1: Submit idea → get clarifying questions
  const handleSubmitIdea = () => {
    if (!idea.trim()) return;
    setStep('questions');
  };

  // Step 2: Answer questions → generate rearticulation
  const handleAnswerQuestions = () => {
    const answered = questions.filter((q) => q.answer.trim());
    if (answered.length < 3) return;

    const target = questions.find((q) => q.id === 'q1')?.answer || 'Not specified';
    const value = questions.find((q) => q.id === 'q2')?.answer || 'Not specified';
    const revenue = questions.find((q) => q.id === 'q3')?.answer || 'Subscription model';
    const milestones = questions.find((q) => q.id === 'q4')?.answer || 'MVP in 30 days';
    const risks = questions.find((q) => q.id === 'q5')?.answer || 'Market validation needed';

    const reartic = `# Venture: ${idea.slice(0, 60)}

## Problem Statement
${idea}

## Target Customer
${target}

## Value Proposition
${value}

## Revenue Model
${revenue}

## 90-Day Milestones
${milestones}

## Key Risks & Assumptions
${risks}`;

    setRearticulation(reartic);
    setStep('rearticulation');
  };

  // Step 3: Approve rearticulation → generate plan
  const handleApproveRearticulation = () => {
    setStep('plan');

    setTimeout(() => {
      const target = questions.find((q) => q.id === 'q1')?.answer || 'target market';
      const value = questions.find((q) => q.id === 'q2')?.answer || 'value prop';
      const revenue = questions.find((q) => q.id === 'q3')?.answer || 'subscription';

      setPlan({
        title: idea.slice(0, 60),
        tasks: [
          { title: 'Define Business Model Canvas', criteria: ['All 9 BMC sections filled', 'Revenue streams validated', 'Cost structure estimated'] },
          { title: 'Build Revenue Model', criteria: ['Pricing tiers defined', 'Unit economics calculated (CAC, LTV, payback)', 'Revenue projections for 12 months'] },
          { title: 'Create MVP Technical Specification', criteria: ['Architecture documented', 'API endpoints defined', 'Data model designed', 'Acceptance criteria per feature'] },
          { title: 'Implement Core Features', criteria: ['Authentication system', 'Core business logic', 'API endpoints', 'Basic UI'] },
          { title: 'Quality Audit', criteria: ['AEGIS audit passes with no critical findings', 'Security review complete', 'Performance benchmarks met'] },
          { title: 'Launch & Track Metrics', criteria: ['Dashboard shows real-time metrics', 'Customer feedback loop established', 'Iteration plan defined'] },
        ],
        sections: [
          { title: 'Business Overview', content: `Target: ${target}\n\nValue: ${value}\n\nRevenue: ${revenue}`, type: 'business' },
          { title: 'Technical Architecture', content: 'To be defined by PAUL after business approval.\n\nStack: React + Fastify + PostgreSQL\nDeployment: Docker Compose\nMonitoring: Prometheus + Grafana', type: 'technical' },
          { title: 'Success Metrics', content: 'MRR target, customer acquisition cost, LTV/CAC ratio, churn rate to be established during BMAD process.', type: 'business' },
        ],
      });
    }, 500);
  };

  // Step 4: Approve plan → create venture on canvas
  const handleApprovePlan = () => {
    if (!plan) return;

    const zoneName = plan.title;
    createZone('business', zoneName, { x: 0, y: 0 });

    const zones = useCanvasStore.getState().zones;
    const newZone = zones[zones.length - 1];

    createCard('bmc', newZone.id, { x: 60, y: 80 }, {
      title: `${zoneName} — Business Model Canvas`,
      partners: '', activities: '', resources: '',
      value: questions.find((q) => q.id === 'q2')?.answer || '',
      relationships: '', channels: '',
      segments: questions.find((q) => q.id === 'q1')?.answer || '',
      cost: '', revenue: questions.find((q) => q.id === 'q3')?.answer || '',
    });

    createCard('revenue', newZone.id, { x: 500, y: 80 }, {
      title: `${zoneName} — Revenue Model`,
      model: 'subscription', price: 49, customers: 0, churn: 5, cac: 100,
    });

    createCard('gate', newZone.id, { x: 60, y: 440 }, {
      title: 'Venture Approval',
      status: 'approved',
      description: `Venture approved by ${user?.name || 'founder'}. Proceeding to technical implementation.`,
      milestone: 'Venture Kickoff',
    });

    setStep('approved');
  };

  // Step 5: Approved → begin CEO hiring
  const handleBeginCeoHiring = () => {
    setStep('ceo_hiring');
    setCeoPhase('analyzing');

    // Simulate CEO analysis phase
    setTimeout(() => setCeoPhase('summary'), 3000);
  };

  // Step 6: CEO Hiring summary → begin team assembly
  const handleBeginTeamAssembly = async () => {
    setStep('team_assembly');
    setHiringIndex(0);

    // Create company in Paperclip
    try {
      const company = await paperclipApi.createCompany({
        name: plan?.title || idea.slice(0, 60),
        type: 'venture',
        founderId: user?.id,
      });
      setCompanyId((company as any)?.id || (company as any)?.companyId || 'demo-company');
    } catch {
      setCompanyId('demo-company');
    }
  };

  // Sequential agent hiring animation
  useEffect(() => {
    if (step !== 'team_assembly') return;
    if (hiringIndex >= INITIAL_AGENT_SPECS.length) {
      // All agents hired → move to execution
      setTimeout(() => setStep('execution_started'), 1500);
      return;
    }

    const timer = setTimeout(async () => {
      const agent = INITIAL_AGENT_SPECS[hiringIndex];

      // Try to register agent with Paperclip API
      if (companyId && companyId !== 'demo-company') {
        try {
          await paperclipApi.createAgent(companyId, {
            name: agent.name,
            role: agent.role,
            adapterType: agent.adapterType,
            heartbeatSchedule: agent.heartbeatSchedule,
          });
        } catch {
          // Continue animation even if API fails
        }
      }

      setAgentSpecs((prev) =>
        prev.map((a, i) => (i === hiringIndex ? { ...a, hired: true } : a))
      );
      setHiringIndex((prev) => prev + 1);
    }, 1800);

    return () => clearTimeout(timer);
  }, [step, hiringIndex, companyId]);

  const updateQuestion = (id: string, answer: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  const currentStepIdx = STEP_KEYS.indexOf(step);

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb size={24} className="text-amber" />
          <h1 className="text-2xl font-bold">New Venture</h1>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {STEP_LABELS.map((s, i) => {
            const isActive = i <= currentStepIdx;
            return (
              <React.Fragment key={s}>
                {i > 0 && <div className={`w-6 h-px ${isActive ? 'bg-primary' : 'bg-border'}`} />}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium ${isActive ? 'bg-primary-muted text-primary' : 'text-fg-muted'}`}>
                  {i < currentStepIdx ? <CheckCircle size={10} /> : null}
                  {s}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Step 1: Input idea ────────────────────────────────────────────── */}
        {step === 'input' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
            <h2 className="text-lg font-bold mb-4">What venture do you want to build?</h2>
            <p className="text-sm text-fg-muted mb-4">Describe your idea. PAUL will ask clarifying questions to help shape it into a structured plan.</p>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., An AI-powered note-taking app that automatically organizes and connects ideas across meetings, documents, and conversations..."
              className="w-full h-40 p-4 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none resize-none"
            />
            <button
              onClick={handleSubmitIdea}
              disabled={!idea.trim()}
              className="mt-4 px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── Step 2: Clarifying questions ──────────────────────────────────── */}
        {step === 'questions' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={20} className="text-accent" />
              <h2 className="text-lg font-bold">PAUL needs more context</h2>
            </div>
            <p className="text-sm text-fg-muted mb-6">Answer these questions to help PAUL generate a structured plan. At least 3 answers required.</p>

            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-primary mr-2">{i + 1}.</span>
                    {q.question}
                  </label>
                  <textarea
                    value={q.answer}
                    onChange={(e) => updateQuestion(q.id, e.target.value)}
                    placeholder="Your answer..."
                    className="w-full h-20 p-3 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleAnswerQuestions} className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2">
                Generate Rearticulation <ArrowRight size={16} />
              </button>
              <button onClick={() => setStep('input')} className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1">
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Rearticulation ────────────────────────────────────────── */}
        {step === 'rearticulation' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
            <h2 className="text-lg font-bold mb-2">Venture Rearticulation</h2>
            <p className="text-sm text-fg-muted mb-4">PAUL has rearticulated your idea into a structured format. Review and approve to proceed.</p>

            <div className="p-4 bg-elevated/70 border border-border rounded-md">
              <pre className="text-sm text-fg-secondary whitespace-pre-wrap font-body">{rearticulation}</pre>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleApproveRearticulation} className="px-6 py-2.5 bg-success text-fg-inverse font-semibold rounded-md hover:bg-success/80 transition-colors flex items-center gap-2">
                <CheckCircle size={16} /> Approve & Generate Plan
              </button>
              <button onClick={() => setStep('questions')} className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1">
                <ArrowLeft size={14} /> Revise Answers
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Plan ──────────────────────────────────────────────────── */}
        {step === 'plan' && plan && (
          <div className="space-y-6">
            <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
              <h2 className="text-lg font-bold mb-1">{plan.title}</h2>
              <Badge variant="info">Generated by PAUL</Badge>

              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Tasks & Acceptance Criteria</h3>
                {plan.tasks.map((task, i) => (
                  <div key={i} className="p-3 rounded-md bg-hover/40 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-primary-muted text-primary flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                      <span className="text-sm font-medium">{task.title}</span>
                    </div>
                    <ul className="ml-7 space-y-0.5">
                      {task.criteria.map((c, j) => (
                        <li key={j} className="text-xs text-fg-muted">• {c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-4">Sections for Review</h3>
              {plan.sections.map((section, i) => (
                <div key={i} className="mb-4 p-4 rounded-md bg-hover/40 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={section.type === 'business' ? 'warning' : 'info'}>{section.type}</Badge>
                    <h4 className="text-sm font-semibold">{section.title}</h4>
                  </div>
                  <p className="text-sm text-fg-secondary whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleApprovePlan} className="px-6 py-2.5 bg-success text-fg-inverse font-semibold rounded-md hover:bg-success/80 transition-colors flex items-center gap-2">
                <CheckCircle size={16} /> Approve & Create Venture
              </button>
              <button onClick={() => setStep('rearticulation')} className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1">
                <ArrowLeft size={14} /> Revise
              </button>
            </div>
          </div>
        )}

        {/* ── Step 5: Approved ──────────────────────────────────────────────── */}
        {step === 'approved' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-8 text-center">
            <CheckCircle size={48} className="text-success mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Venture Created!</h2>
            <p className="text-sm text-fg-muted mb-6">Your venture has been added to the canvas with a Business Model Canvas and Revenue Calculator.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleBeginCeoHiring}
                className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Users size={16} /> Begin CEO Hiring
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 text-fg-muted hover:text-fg border border-border rounded-md transition-colors"
              >
                Go to Canvas
              </button>
            </div>
          </div>
        )}

        {/* ── Step 6: CEO Hiring ────────────────────────────────────────────── */}
        {step === 'ceo_hiring' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-muted flex items-center justify-center">
                <Briefcase size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">CEO Agent</h2>
                <p className="text-xs text-fg-muted">Analyzing venture plan</p>
              </div>
            </div>

            {ceoPhase === 'analyzing' ? (
              <div className="text-center py-12">
                <Loader size={32} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-sm text-fg-secondary mb-2">CEO agent is analyzing your venture plan...</p>
                <p className="text-xs text-fg-muted">Evaluating requirements, identifying skill gaps, and determining optimal team composition.</p>

                <div className="mt-8 max-w-md mx-auto space-y-2">
                  {['Reviewing business requirements...', 'Evaluating technical complexity...', 'Identifying required roles...', 'Calculating resource allocation...'].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-fg-muted" style={{ animationDelay: `${i * 0.7}s` }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.7}s` }} />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-fg-secondary mb-6">Based on your venture plan, the CEO agent recommends hiring the following team:</p>

                <div className="grid grid-cols-2 gap-3">
                  {INITIAL_AGENT_SPECS.map((agent) => (
                    <div key={agent.name} className="p-4 rounded-md bg-hover/40 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        {agent.icon}
                        <div>
                          <p className="text-sm font-semibold">{agent.name}</p>
                          <p className="text-xs text-fg-muted">{agent.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="neutral">{agent.adapterType}</Badge>
                        <span className="text-[10px] text-fg-muted">HB: {agent.heartbeatSchedule}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleBeginTeamAssembly}
                  className="mt-6 px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Users size={16} /> Assemble Team
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 7: Team Assembly ─────────────────────────────────────────── */}
        {step === 'team_assembly' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} className="text-primary" />
              <h2 className="text-lg font-bold">Assembling Team</h2>
              <Badge variant="info">{agentSpecs.filter((a) => a.hired).length}/{agentSpecs.length} hired</Badge>
            </div>

            <div className="space-y-3">
              {agentSpecs.map((agent, i) => (
                <div
                  key={agent.name}
                  className={`p-4 rounded-md border transition-all duration-500 ${
                    agent.hired
                      ? 'bg-elevated/50 border-primary/30 opacity-100 translate-x-0'
                      : i === hiringIndex
                        ? 'bg-hover/40 border-amber/30 opacity-80'
                        : 'bg-surface/30 border-border opacity-30'
                  }`}
                  style={{
                    transform: agent.hired ? 'translateX(0)' : i === hiringIndex ? 'translateX(0)' : 'translateX(-10px)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {agent.icon}
                      <div>
                        <p className="text-sm font-semibold">{agent.name}</p>
                        <p className="text-xs text-fg-muted">{agent.role} • {agent.adapterType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent.hired ? (
                        <Badge variant="success">
                          <CheckCircle size={10} className="mr-1" /> Active
                        </Badge>
                      ) : i === hiringIndex ? (
                        <Badge variant="warning">
                          <Loader size={10} className="animate-spin mr-1" /> Hiring...
                        </Badge>
                      ) : (
                        <Badge variant="neutral">Pending</Badge>
                      )}
                      <span className="text-[10px] text-fg-muted font-mono">{agent.heartbeatSchedule}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 8: Execution Started ─────────────────────────────────────── */}
        {step === 'execution_started' && (
          <div className="space-y-6">
            <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-8 text-center">
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Execution Started!</h2>
              <p className="text-sm text-fg-muted mb-6">
                Your team of {agentSpecs.length} AI agents has been assembled and is now executing the venture plan.
              </p>
            </div>

            {/* Team summary */}
            <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-4">Assembled Team</h3>
              <div className="grid grid-cols-2 gap-3">
                {agentSpecs.map((agent) => (
                  <div key={agent.name} className="flex items-center gap-3 p-3 rounded-md bg-hover/40 border border-border">
                    {agent.icon}
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-fg-muted">{agent.role}</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation links */}
            <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-6">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-4">Monitor & Control</h3>
              <div className="grid grid-cols-3 gap-3">
                <Link
                  to="/swarm"
                  className="p-4 rounded-md bg-hover/40 border border-border hover:border-primary/30 transition-colors text-center"
                >
                  <Users size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Swarm</p>
                  <p className="text-xs text-fg-muted">Agent coordination</p>
                </Link>
                <Link
                  to="/conductor"
                  className="p-4 rounded-md bg-hover/40 border border-border hover:border-primary/30 transition-colors text-center"
                >
                  <Zap size={24} className="text-amber mx-auto mb-2" />
                  <p className="text-sm font-medium">Conductor</p>
                  <p className="text-xs text-fg-muted">Task orchestration</p>
                </Link>
                <Link
                  to="/orchestrator"
                  className="p-4 rounded-md bg-hover/40 border border-border hover:border-primary/30 transition-colors text-center"
                >
                  <Cpu size={24} className="text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium">Orchestrator</p>
                  <p className="text-xs text-fg-muted">System overview</p>
                </Link>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/swarm')}
                className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors"
              >
                Go to Swarm
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 text-fg-muted hover:text-fg border border-border rounded-md transition-colors"
              >
                Go to Canvas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
