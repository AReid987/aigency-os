import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { Badge } from '@aigency-os/ui';
import { FileUpload } from '../components/FileUpload';
import {
  Lightbulb, ArrowRight, ArrowLeft, CheckCircle, MessageSquare,
  FileText, Send, Cpu, Loader, Zap, Users, Upload, Bot,
  Target, DollarSign, TrendingUp, Shield, AlertTriangle,
  Users2, Layers, Compass, Calendar, ChevronRight,
} from 'lucide-react';
import { paperclipApi } from '../api/services';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'idea' | 'interview' | 'requirements' | 'review' | 'goal' | 'files' | 'launching' | 'launched';

interface InterviewQuestion {
  id: string;
  category: string;
  icon: React.ReactNode;
  question: string;
  recommendation: string;
  followUp: string;
}

interface InterviewAnswer {
  questionId: string;
  answer: string;
  isCustom: boolean;
}

interface Requirement {
  id: string;
  category: string;
  question: string;
  options: string[];
  selected: string;
  custom: string;
}

interface GoalDocuments {
  goalMd: string;
  planMd: string;
  factsMd: string;
}

interface ChatMessage {
  id: string;
  role: 'agent' | 'user';
  content: string;
  timestamp: number;
}

// ─── Interview Questions Generator ───────────────────────────────────────────

function getInterviewQuestions(idea: string): InterviewQuestion[] {
  const ideaSnippet = idea.length > 60 ? idea.slice(0, 60) + '...' : idea;

  return [
    {
      id: 'target',
      category: 'Target Customer',
      icon: <Target size={14} />,
      question: `Who is the primary target customer for "${ideaSnippet}"? Be as specific as possible — what industry, company size, or persona are you going after?`,
      recommendation: 'Small to mid-size businesses (1-200 employees) in technology-forward industries looking to automate repetitive workflows',
      followUp: 'Great choice. Understanding the customer is the foundation of everything.',
    },
    {
      id: 'value',
      category: 'Value Proposition',
      icon: <Zap size={14} />,
      question: 'What is the core value proposition that makes this venture different from existing solutions? What pain point does it uniquely solve?',
      recommendation: 'AI-first autonomous approach — agents handle the work end-to-end without human intervention, delivering 10x faster results at 1/10th the cost',
      followUp: 'A strong value prop is the engine of a venture. This positions you well.',
    },
    {
      id: 'revenue',
      category: 'Revenue Model',
      icon: <DollarSign size={14} />,
      question: 'How will this venture generate revenue? Think about what your customer would naturally pay for and how they prefer to buy.',
      recommendation: 'Tiered SaaS subscription — Free (trial), Pro ($49/mo), Enterprise (custom) with usage-based overage',
      followUp: 'Subscription models create predictable revenue. Good foundation for growth.',
    },
    {
      id: 'economics',
      category: 'Unit Economics',
      icon: <TrendingUp size={14} />,
      question: 'What do you expect the unit economics to look like? Think about customer acquisition cost (CAC), lifetime value (LTV), and margins.',
      recommendation: 'Target CAC < $100, LTV > $1,500 (LTV:CAC ratio > 15:1), gross margins > 80% through AI-driven delivery',
      followUp: 'Healthy unit economics are the foundation of a sustainable business.',
    },
    {
      id: 'mvp',
      category: 'MVP Scope',
      icon: <Layers size={14} />,
      question: 'What is the minimum viable product for the first 30 days? What is the ONE thing that must work perfectly to validate the idea?',
      recommendation: 'Core workflow automation for a single use case — one thing done exceptionally well with a polished onboarding experience',
      followUp: 'Focused MVPs ship faster and learn faster. You can always expand later.',
    },
    {
      id: 'risk',
      category: 'Biggest Risk',
      icon: <AlertTriangle size={14} />,
      question: 'What is the single biggest risk that could kill this venture? What assumption, if wrong, would make you want to pivot immediately?',
      recommendation: 'Market demand — uncertainty whether customers will pay for AI-automated solutions vs. human-driven alternatives',
      followUp: 'Identifying the biggest risk early means you can validate it before committing resources.',
    },
    {
      id: 'team',
      category: 'Team Structure',
      icon: <Users2 size={14} />,
      question: 'What agent team composition should the CEO assemble first? What roles are most critical in the first sprint?',
      recommendation: 'Technical-heavy: CTO + 2 Engineers + QA — build the core product fast, then add growth roles',
      followUp: 'The right team composition can make or break the first 90 days.',
    },
    {
      id: 'moat',
      category: 'Competitive Moat',
      icon: <Shield size={14} />,
      question: 'What is your competitive moat? Why would a customer choose you over alternatives, and why would it be hard for competitors to copy you?',
      recommendation: 'Proprietary AI models trained on domain-specific data + network effects from shared learnings across customers',
      followUp: 'A defensible moat is what separates venture-scale businesses from features.',
    },
    {
      id: 'distribution',
      category: 'Distribution',
      icon: <Compass size={14} />,
      question: 'How will you reach your first 100 customers? What channels or strategies will you use for distribution?',
      recommendation: 'Product-led growth with viral loops — free tier drives adoption, in-product sharing drives organic growth, supplemented by targeted outbound',
      followUp: 'Distribution is often the difference between a good product and a successful business.',
    },
    {
      id: 'milestones',
      category: 'Milestones',
      icon: <Calendar size={14} />,
      question: 'What are the key milestones for the first 90 days? What specific, measurable outcomes would make you confident the venture is on track?',
      recommendation: 'Day 30: MVP live with 10 beta users. Day 60: First paying customer + 50 users. Day 90: $5K MRR + 200 users + Series A prep',
      followUp: 'Clear milestones create accountability and momentum. These are ambitious but achievable.',
    },
  ];
}

// ─── Document Generators ─────────────────────────────────────────────────────

function generateGoalMd(idea: string, answers: InterviewAnswer[], questions: InterviewQuestion[]): string {
  const getAnswer = (id: string) => {
    const a = answers.find((a) => a.questionId === id);
    return a?.answer || '';
  };

  return `# Goal Document

## Mission
Build and launch "${idea.slice(0, 120)}" using an AI-agent team.

## Objectives
1. **Validate the core value proposition** within 30 days
2. **Achieve first revenue** within 60 days
3. **Reach product-market fit signals** within 90 days

## Target Customer
${getAnswer('target')}

## Value Proposition
${getAnswer('value')}

## Revenue Model
${getAnswer('revenue')}

## Success Criteria
- MVP shipped within 30 days
- First paying customer within 60 days
- Positive unit economics validated within 90 days
- Team fully operational within first week

## Key Decisions
${answers.map((a) => {
  const q = questions.find((q) => q.id === a.questionId);
  return `- **${q?.category || a.questionId}**: ${a.answer}`;
}).join('\n')}
`;
}

function generatePlanMd(idea: string, answers: InterviewAnswer[], questions: InterviewQuestion[]): string {
  const getAnswer = (id: string) => {
    const a = answers.find((a) => a.questionId === id);
    return a?.answer || '';
  };

  return `# Execution Plan

## Phase 1: Foundation (Days 1–7)
- Assemble core team: ${getAnswer('team')}
- Set up development infrastructure and CI/CD
- Define technical architecture and data models
- Create brand identity and landing page

### Acceptance Criteria
- [ ] Team onboarded and operational
- [ ] Development environment live
- [ ] Architecture document approved by CTO

## Phase 2: MVP Build (Days 8–30)
- Build core feature: ${getAnswer('mvp')}
- Implement authentication and user management
- Create onboarding flow
- Internal alpha testing

### Acceptance Criteria
- [ ] Core feature functional end-to-end
- [ ] 5 internal team members completed full flow
- [ ] Critical bugs resolved
- [ ] Landing page live with waitlist

## Phase 3: Beta Launch (Days 31–60)
- Launch to beta users
- Implement feedback loops and analytics
- Begin distribution: ${getAnswer('distribution')}
- Iterate on core value prop based on feedback

### Acceptance Criteria
- [ ] 50+ beta users onboarded
- [ ] NPS > 40 from beta cohort
- [ ] First paying customer acquired
- [ ] Revenue model validated with real transactions

## Phase 4: Growth (Days 61–90)
- Scale distribution channels
- Optimize unit economics: ${getAnswer('economics')}
- Build competitive moat: ${getAnswer('moat')}
- Prepare for next phase of growth

### Acceptance Criteria
- [ ] ${getAnswer('milestones')}
- [ ] Sustainable growth trajectory established
- [ ] Team performance metrics baseline set
`;
}

function generateFactsMd(idea: string, answers: InterviewAnswer[], questions: InterviewQuestion[]): string {
  const getAnswer = (id: string) => {
    const a = answers.find((a) => a.questionId === id);
    return a?.answer || '';
  };

  return `# Key Facts & Assumptions

## Venture Summary
**Idea**: ${idea}

**Created**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## Key Decisions

${answers.map((a) => {
  const q = questions.find((q) => q.id === a.questionId);
  return `### ${q?.category || a.questionId}
**Decision**: ${a.answer}
**Rationale**: Selected based on venture interview analysis.
`;
}).join('\n')}

---

## Assumptions
1. The target market (${getAnswer('target')}) has sufficient demand
2. AI-agent delivery can achieve the promised quality and speed
3. The revenue model (${getAnswer('revenue')}) aligns with customer purchasing habits
4. Unit economics (${getAnswer('economics')}) are achievable at scale
5. The competitive moat (${getAnswer('moat')}) is defensible

## Constraints
- First 90 days are critical for validation
- Budget allocated for agent compute and infrastructure
- Team size limited to core roles initially
- Must achieve positive unit economics before scaling

## Risk Register
| Risk | Severity | Mitigation |
|------|----------|------------|
| ${getAnswer('risk')} | High | Early validation sprint in Phase 2 |
| Technical feasibility | Medium | Prototype-first approach |
| Market timing | Medium | Continuous customer discovery |
`;
}

// ─── Chat Bubble Component ───────────────────────────────────────────────────

function Bubble({ role, children }: { role: 'agent' | 'user'; children: React.ReactNode }) {
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

// ─── Typing Indicator ────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-surface/70 backdrop-blur-md border border-border rounded-lg px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-fg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-fg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-fg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Progress Steps ──────────────────────────────────────────────────────────

function PhaseProgress({ current }: { current: Phase }) {
  const phases: { key: Phase; label: string }[] = [
    { key: 'idea', label: 'Idea' },
    { key: 'interview', label: 'Interview' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'review', label: 'Review' },
    { key: 'goal', label: 'Goal' },
    { key: 'files', label: 'Files' },
    { key: 'launching', label: 'Launch' },
  ];

  const currentIndex = phases.findIndex((p) => p.key === current);

  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
      {phases.map((p, i) => (
        <React.Fragment key={p.key}>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              i < currentIndex
                ? 'bg-success/20 text-success'
                : i === currentIndex
                  ? 'bg-primary/20 text-primary'
                  : 'bg-elevated/50 text-fg-muted'
            }`}
          >
            {i < currentIndex ? (
              <CheckCircle size={12} />
            ) : i === currentIndex ? (
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-fg-muted/40" />
            )}
            <span className="hidden sm:inline">{p.label}</span>
          </div>
          {i < phases.length - 1 && (
            <ChevronRight size={12} className="text-fg-muted/40 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function VenturePage() {
  const navigate = useNavigate();
  const createZone = useCanvasStore((s) => s.createZone);
  const createCard = useCanvasStore((s) => s.createCard);
  const user = useAuthStore((s) => s.user);

  // ── Core state ─────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('idea');
  const [idea, setIdea] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // ── Interview state ────────────────────────────────────────────────────────
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [interviewAnswers, setInterviewAnswers] = useState<InterviewAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Requirements state ─────────────────────────────────────────────────────
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  // ── Goal state ─────────────────────────────────────────────────────────────
  const [goalDocs, setGoalDocs] = useState<GoalDocuments | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'goal' | 'plan' | 'facts'>('goal');

  // ── Launch state ───────────────────────────────────────────────────────────
  const [launchStatus, setLaunchStatus] = useState('');
  const [launchProgress, setLaunchProgress] = useState(0);

  // ── Auto-scroll chat ───────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // ── Phase 1: Submit idea → start interview ─────────────────────────────────

  const handleIdeaSubmit = () => {
    if (!idea.trim()) return;

    const questions = getInterviewQuestions(idea);
    setInterviewQuestions(questions);
    setCurrentQuestionIndex(0);
    setInterviewAnswers([]);

    // Initialize chat with opening message
    const openingMessages: ChatMessage[] = [
      {
        id: 'open-1',
        role: 'agent',
        content: `Great idea! Let me ask you some questions to shape this venture properly. I'll ask one at a time, and I'll provide a recommended answer based on what you've described. You can accept my recommendation or type your own answer.`,
        timestamp: Date.now(),
      },
      {
        id: 'open-2',
        role: 'agent',
        content: `**Question 1 of ${questions.length} — ${questions[0].category}**\n\n${questions[0].question}`,
        timestamp: Date.now() + 1,
      },
    ];

    setChatMessages(openingMessages);
    setShowRecommendation(true);
    setPhase('interview');
  };

  // ── Phase 2: Handle interview answer ───────────────────────────────────────

  const handleAcceptRecommendation = useCallback(() => {
    const currentQ = interviewQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const answer: InterviewAnswer = {
      questionId: currentQ.id,
      answer: currentQ.recommendation,
      isCustom: false,
    };

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${currentQuestionIndex}`,
      role: 'user',
      content: `✅ ${currentQ.recommendation}`,
      timestamp: Date.now(),
    };

    setInterviewAnswers((prev) => [...prev, answer]);
    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setShowRecommendation(false);

    // Simulate agent typing then ask next question
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const followUp: ChatMessage = {
        id: `followup-${currentQuestionIndex}`,
        role: 'agent',
        content: currentQ.followUp,
        timestamp: Date.now(),
      };

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < interviewQuestions.length) {
        const nextQ = interviewQuestions[nextIndex];
        const nextMsg: ChatMessage = {
          id: `q-${nextIndex}`,
          role: 'agent',
          content: `**Question ${nextIndex + 1} of ${interviewQuestions.length} — ${nextQ.category}**\n\n${nextQ.question}`,
          timestamp: Date.now() + 1,
        };

        setChatMessages((prev) => [...prev, followUp, nextMsg]);
        setCurrentQuestionIndex(nextIndex);
        setShowRecommendation(true);
      } else {
        // Interview complete
        const completeMsg: ChatMessage = {
          id: 'complete',
          role: 'agent',
          content: `That's all the questions! I have a solid picture of your venture now. Let me compile your answers into structured requirements for your review.`,
          timestamp: Date.now() + 1,
        };
        setChatMessages((prev) => [...prev, followUp, completeMsg]);

        // Move to requirements after a short delay
        setTimeout(() => {
          buildRequirements([...interviewAnswers, answer]);
        }, 1500);
      }
    }, 1200);
  }, [currentQuestionIndex, interviewQuestions, interviewAnswers]);

  const handleSendCustomAnswer = useCallback(() => {
    if (!userInput.trim()) return;

    const currentQ = interviewQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const answer: InterviewAnswer = {
      questionId: currentQ.id,
      answer: userInput.trim(),
      isCustom: true,
    };

    const userMsg: ChatMessage = {
      id: `user-${currentQuestionIndex}`,
      role: 'user',
      content: userInput.trim(),
      timestamp: Date.now(),
    };

    setInterviewAnswers((prev) => [...prev, answer]);
    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setShowRecommendation(false);

    // Simulate agent typing then ask next question
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const followUp: ChatMessage = {
        id: `followup-${currentQuestionIndex}`,
        role: 'agent',
        content: currentQ.followUp,
        timestamp: Date.now(),
      };

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < interviewQuestions.length) {
        const nextQ = interviewQuestions[nextIndex];
        const nextMsg: ChatMessage = {
          id: `q-${nextIndex}`,
          role: 'agent',
          content: `**Question ${nextIndex + 1} of ${interviewQuestions.length} — ${nextQ.category}**\n\n${nextQ.question}`,
          timestamp: Date.now() + 1,
        };

        setChatMessages((prev) => [...prev, followUp, nextMsg]);
        setCurrentQuestionIndex(nextIndex);
        setShowRecommendation(true);
      } else {
        const completeMsg: ChatMessage = {
          id: 'complete',
          role: 'agent',
          content: `That's all the questions! I have a solid picture of your venture now. Let me compile your answers into structured requirements for your review.`,
          timestamp: Date.now() + 1,
        };
        setChatMessages((prev) => [...prev, followUp, completeMsg]);

        setTimeout(() => {
          buildRequirements([...interviewAnswers, answer]);
        }, 1500);
      }
    }, 1200);
  }, [currentQuestionIndex, interviewQuestions, interviewAnswers, userInput]);

  // ── Build requirements from interview answers ──────────────────────────────

  const buildRequirements = (allAnswers: InterviewAnswer[]) => {
    const reqs: Requirement[] = interviewQuestions.map((q) => {
      const answer = allAnswers.find((a) => a.questionId === q.id);
      return {
        id: q.id,
        category: q.category,
        question: q.question,
        options: [q.recommendation, generateAltOption1(q.id), generateAltOption2(q.id)],
        selected: answer?.answer || q.recommendation,
        custom: answer?.isCustom ? answer.answer : '',
      };
    });
    setRequirements(reqs);
    setPhase('requirements');
  };

  // ── Alternative options for requirements ───────────────────────────────────

  function generateAltOption1(id: string): string {
    const alts: Record<string, string> = {
      target: 'Enterprise teams (500+ employees) with dedicated IT departments and budget for automation',
      value: 'Lower cost than existing solutions with dramatically better UX — democratize access for smaller teams',
      revenue: 'Usage-based pricing — pay per action, API call, or processed item with volume discounts',
      economics: 'Target CAC < $50, LTV > $800 (LTV:CAC ratio > 16:1), gross margins > 70% through hybrid delivery',
      mvp: 'Full workflow — end-to-end automation for a single high-value use case with real customer data',
      risk: 'Technical feasibility — uncertainty whether AI agents can deliver consistent quality at production scale',
      team: 'Balanced: CTO + Engineer + CMO + Sales — build and sell simultaneously from day one',
      moat: 'Distribution advantage — partnerships and integrations with existing platforms that competitors can\'t replicate',
      distribution: 'Outbound sales with content marketing — targeted outreach to ideal customer profiles with educational content',
      milestones: 'Day 30: Working prototype with 5 design partners. Day 60: First revenue + 30 users. Day 90: $10K MRR + 100 users',
    };
    return alts[id] || 'Alternative approach — tailored to specific market conditions';
  }

  function generateAltOption2(id: string): string {
    const alts: Record<string, string> = {
      target: 'Individual creators and freelancers who need AI assistance but can\'t afford enterprise tools',
      value: 'Unique data or methodology that competitors lack — proprietary approach that creates lasting differentiation',
      revenue: 'Freemium model — generous free tier for adoption + premium features for power users and teams',
      economics: 'Target CAC < $200, LTV > $3,000 (LTV:CAC ratio > 15:1), gross margins > 90% through pure software delivery',
      mvp: 'Platform approach — multi-tenant with API for integrations, targeting developer-first adoption',
      risk: 'Distribution — uncertainty about how to reach the first 100 customers cost-effectively',
      team: 'Growth-first: CMO + Sales + Content + Engineer — maximize market learning and revenue from day one',
      moat: 'Data network effects — each customer improves the product for all customers, creating compounding value',
      distribution: 'Community-led growth — build in public, create a developer community, leverage word-of-mouth and referrals',
      milestones: 'Day 30: MVP live with 25 beta users. Day 60: Product-market fit signals + 75 users. Day 90: $3K MRR + 150 users + growth playbook',
    };
    return alts[id] || 'Third approach — optimized for a different risk/reward profile';
  }

  // ── Requirements handlers ──────────────────────────────────────────────────

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

  // ── Review → Goal ─────────────────────────────────────────────────────────

  const handleGenerateGoal = () => {
    const answers = requirements.map((r) => ({
      questionId: r.id,
      answer: r.selected === 'Other' ? r.custom : r.selected,
      isCustom: r.selected === 'Other',
    }));

    const docs: GoalDocuments = {
      goalMd: generateGoalMd(idea, answers, interviewQuestions),
      planMd: generatePlanMd(idea, answers, interviewQuestions),
      factsMd: generateFactsMd(idea, answers, interviewQuestions),
    };

    setGoalDocs(docs);
    setPhase('goal');
  };

  // ── Goal → Launch ─────────────────────────────────────────────────────────

  const handleApprove = async () => {
    if (!goalDocs) return;
    setPhase('launching');
    setLaunchProgress(0);
    setLaunchStatus('Creating venture company...');

    // 1. Create company in Paperclip
    let cId = 'demo-company';
    try {
      setLaunchProgress(10);
      const company = await paperclipApi.createCompany({
        name: idea.slice(0, 80),
        mission: `Build and launch "${idea.slice(0, 80)}" using an AI-agent team.`,
        goal: goalDocs.goalMd,
      });
      cId = (company as any)?.id || (company as any)?.companyId || 'demo-company';
      setLaunchProgress(30);
    } catch {
      setLaunchProgress(30);
      // API unreachable — continue with demo
    }

    // 2. Create CEO agent
    setLaunchStatus('Hiring CEO agent...');
    try {
      setLaunchProgress(40);
      await paperclipApi.createAgent(cId, {
        name: 'CEO',
        role: 'CEO',
        adapterType: 'hermes',
        heartbeatSchedule: '*/5 * * * *',
      });
      setLaunchProgress(60);
    } catch {
      setLaunchProgress(60);
    }

    // 3. Create initial goal
    setLaunchStatus('Handing goal document to CEO...');
    try {
      setLaunchProgress(70);
      await paperclipApi.createGoal(cId, {
        title: idea.slice(0, 80),
        description: goalDocs.goalMd,
        priority: 'P0',
      });
      setLaunchProgress(85);
    } catch {
      setLaunchProgress(85);
    }

    // 4. Create canvas zone with goal doc
    setLaunchStatus('Setting up canvas workspace...');
    setLaunchProgress(90);
    createZone('business', idea.slice(0, 80), { x: 0, y: 0 });
    const zones = useCanvasStore.getState().zones;
    const newZone = zones[zones.length - 1];

    const getAnswer = (id: string) => {
      const r = requirements.find((r) => r.id === id);
      if (!r) return '';
      return r.selected === 'Other' ? r.custom : r.selected;
    };

    createCard('bmc', newZone.id, { x: 60, y: 80 }, {
      title: `${idea.slice(0, 60)} — Goal Document`,
      partners: '', activities: '', resources: '',
      value: getAnswer('value'),
      relationships: '', channels: getAnswer('distribution'),
      segments: getAnswer('target'),
      cost: '', revenue: getAnswer('revenue'),
    });

    createCard('gate', newZone.id, { x: 60, y: 440 }, {
      title: 'Goal Approved',
      status: 'approved',
      description: `Goal approved by ${user?.name || 'founder'}. CEO agent has received the goal document.`,
      milestone: 'Venture Kickoff',
    });

    setLaunchProgress(100);
    setLaunchStatus('CEO has received the goal document and is beginning execution.');
    setPhase('launched');
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb size={24} className="text-amber" />
          <h1 className="text-2xl font-bold font-display">New Venture</h1>
          {phase !== 'idea' && phase !== 'launched' && (
            <span className="ml-auto">
              <Badge variant={phase === 'launching' ? 'warning' : 'info'}>
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </Badge>
            </span>
          )}
        </div>

        {/* Progress Steps */}
        {phase !== 'launched' && <PhaseProgress current={phase} />}

        {/* ─── Phase: Idea Input ─────────────────────────────────────────── */}
        {phase === 'idea' && (
          <div>
            <Bubble role="agent">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={16} className="text-primary" />
                <p className="font-medium">Venture Planning Agent</p>
              </div>
              <p className="mb-2">Welcome! I'm here to help you shape your venture idea into a structured, actionable plan.</p>
              <p className="text-fg-muted">Describe your business idea below, and I'll conduct a focused interview to uncover the key decisions. Then we'll review everything together before generating your goal documents.</p>
            </Bubble>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">
                Your Venture Idea
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., An AI-powered customer support platform that resolves tickets autonomously, reducing response times from hours to seconds while improving customer satisfaction..."
                className="w-full h-36 p-4 bg-elevated/70 border border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-none font-sans leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleIdeaSubmit();
                  }
                }}
              />
              <p className="text-xs text-fg-muted mt-1.5">Press ⌘+Enter to submit</p>
            </div>

            <button
              onClick={handleIdeaSubmit}
              disabled={!idea.trim()}
              className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <MessageSquare size={16} /> Start Interview
            </button>
          </div>
        )}

        {/* ─── Phase: Interview (Chat-style) ─────────────────────────────── */}
        {phase === 'interview' && (
          <div>
            <div className="bg-surface/50 backdrop-blur-md rounded-lg border border-border p-4 mb-4 max-h-[500px] overflow-y-auto">
              {/* Chat Messages */}
              {chatMessages.map((msg) => (
                <Bubble key={msg.id} role={msg.role}>
                  {msg.role === 'agent' && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Bot size={12} className="text-primary" />
                      <span className="text-xs font-semibold text-primary">Venture Agent</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-fg font-semibold">{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </div>
                </Bubble>
              ))}

              {/* Typing Indicator */}
              {isTyping && <TypingIndicator />}

              <div ref={chatEndRef} />
            </div>

            {/* Recommendation Card */}
            {showRecommendation && !isTyping && currentQuestionIndex < interviewQuestions.length && (
              <div className="mb-4 bg-primary-muted/20 border border-primary/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Recommended Answer</span>
                </div>
                <p className="text-sm text-fg mb-3 leading-relaxed">
                  {interviewQuestions[currentQuestionIndex]?.recommendation}
                </p>
                <button
                  onClick={handleAcceptRecommendation}
                  className="px-4 py-2 bg-primary text-fg-inverse text-sm font-medium rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Accept Recommendation
                </button>
              </div>
            )}

            {/* Custom Input */}
            {showRecommendation && !isTyping && currentQuestionIndex < interviewQuestions.length && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type a custom answer instead..."
                  className="flex-1 px-4 py-2.5 bg-elevated/70 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendCustomAnswer();
                    }
                  }}
                />
                <button
                  onClick={handleSendCustomAnswer}
                  disabled={!userInput.trim()}
                  className="px-4 py-2.5 bg-elevated border border-border rounded-lg text-fg-muted hover:text-fg hover:border-border-hover transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            )}

            {/* Progress indicator */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex) / interviewQuestions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-fg-muted font-medium">
                {currentQuestionIndex}/{interviewQuestions.length}
              </span>
            </div>
          </div>
        )}

        {/* ─── Phase: Requirements ───────────────────────────────────────── */}
        {phase === 'requirements' && (
          <div>
            <Bubble role="agent">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">Venture Agent</span>
              </div>
              <p className="font-medium mb-1">Here are your structured requirements based on the interview.</p>
              <p className="text-fg-muted">Each requirement shows your selected answer as the recommended option. You can change any answer or write your own in "Other".</p>
            </Bubble>

            <div className="space-y-5 mb-6 mt-4">
              {requirements.map((req, i) => {
                const question = interviewQuestions.find((q) => q.id === req.id);
                return (
                  <div key={req.id} className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-7 h-7 rounded-full bg-primary-muted text-primary flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {question?.icon && <span className="text-primary">{question.icon}</span>}
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{req.category}</span>
                        </div>
                        <p className="text-sm text-fg mt-0.5 leading-relaxed">{req.question}</p>
                      </div>
                    </div>

                    <div className="space-y-2 ml-9">
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
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-xs text-fg-muted mt-0.5 shrink-0">{String.fromCharCode(65 + j)}.</span>
                            <span className="leading-relaxed">{opt}</span>
                          </div>
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
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('review')}
                disabled={!allAnswered}
                className="px-5 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowRight size={16} /> Review Decisions
              </button>
              <button
                onClick={() => setPhase('interview')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Interview
              </button>
            </div>
          </div>
        )}

        {/* ─── Phase: Review ─────────────────────────────────────────────── */}
        {phase === 'review' && (
          <div>
            <Bubble role="agent">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">Venture Agent</span>
              </div>
              <p className="font-medium mb-1">Here's your complete venture plan based on your decisions.</p>
              <p className="text-fg-muted">Review everything below. When you're satisfied, I'll generate your goal documents — goal.md, plan.md, and facts.md.</p>
            </Bubble>

            <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-5 mb-6 mt-4">
              <div className="flex items-center gap-3 mb-5">
                <Lightbulb size={20} className="text-amber" />
                <h2 className="text-lg font-bold font-display">{idea.length > 80 ? idea.slice(0, 80) + '...' : idea}</h2>
              </div>

              <div className="space-y-4">
                {requirements.map((req, i) => {
                  const question = interviewQuestions.find((q) => q.id === req.id);
                  const finalAnswer = req.selected === 'Other' ? req.custom : req.selected;
                  return (
                    <div key={req.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <span className="w-7 h-7 rounded-full bg-primary-muted text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {question?.icon && <span className="text-primary">{question.icon}</span>}
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider">{req.category}</p>
                        </div>
                        <p className="text-sm text-fg leading-relaxed">{finalAnswer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerateGoal}
                className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <FileText size={16} /> Generate Goal Documents
              </button>
              <button
                onClick={() => setPhase('requirements')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Revise Requirements
              </button>
            </div>
          </div>
        )}

        {/* ─── Phase: Goal Documents ─────────────────────────────────────── */}
        {phase === 'goal' && goalDocs && (
          <div>
            <Bubble role="agent">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">Venture Agent</span>
              </div>
              <p className="font-medium mb-1">Your goal documents are ready.</p>
              <p className="text-fg-muted">Review the generated documents below. You can upload supporting files, then approve to hand everything off to the CEO agent.</p>
            </Bubble>

            {/* Document Tabs */}
            <div className="flex gap-1 mt-4 mb-4">
              {([
                { key: 'goal' as const, label: 'goal.md', icon: <Target size={14} /> },
                { key: 'plan' as const, label: 'plan.md', icon: <FileText size={14} /> },
                { key: 'facts' as const, label: 'facts.md', icon: <Layers size={14} /> },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveDocTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeDocTab === tab.key
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-elevated/50 text-fg-muted border border-transparent hover:border-border'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Document Content */}
            <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-5 mb-6 max-h-[400px] overflow-y-auto">
              <pre className="text-sm text-fg whitespace-pre-wrap font-sans leading-relaxed">
                {activeDocTab === 'goal' && goalDocs.goalMd}
                {activeDocTab === 'plan' && goalDocs.planMd}
                {activeDocTab === 'facts' && goalDocs.factsMd}
              </pre>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('files')}
                className="px-5 py-2.5 bg-primary text-fg-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Upload size={16} /> Upload Files
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 bg-success text-fg-inverse font-semibold rounded-lg hover:bg-success/80 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} /> Approve & Launch
              </button>
              <button
                onClick={() => setPhase('review')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1 ml-auto"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          </div>
        )}

        {/* ─── Phase: File Upload ────────────────────────────────────────── */}
        {phase === 'files' && (
          <div>
            <Bubble role="agent">
              <div className="flex items-center gap-2 mb-1.5">
                <Bot size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">Venture Agent</span>
              </div>
              <p className="font-medium mb-1">Upload supporting files for your venture.</p>
              <p className="text-fg-muted">Add any documents, assets, pitch decks, market research, or reference files that will help the CEO agent get started. This step is optional.</p>
            </Bubble>

            <div className="mt-4 mb-6">
              <FileUpload
                onFilesSelected={(files) => setUploadedFiles((prev) => [...prev, ...files])}
                maxFiles={10}
                maxSizeMB={50}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 bg-success text-fg-inverse font-semibold rounded-lg hover:bg-success/80 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} /> Approve & Launch
              </button>
              <button
                onClick={() => setPhase('goal')}
                className="px-4 py-2.5 text-fg-muted hover:text-fg flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Goal
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2.5 text-fg-muted hover:text-fg text-sm ml-auto"
              >
                Skip Upload →
              </button>
            </div>
          </div>
        )}

        {/* ─── Phase: Launching ──────────────────────────────────────────── */}
        {phase === 'launching' && (
          <div>
            <Bubble role="agent">
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin text-primary" />
                <p className="font-medium">{launchStatus}</p>
              </div>
            </Bubble>

            {/* Progress Bar */}
            <div className="mt-6 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-fg-muted">Launch Progress</span>
                <span className="text-xs font-medium text-primary">{launchProgress}%</span>
              </div>
              <div className="h-2 bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
                  style={{ width: `${launchProgress}%` }}
                />
              </div>
            </div>

            {/* Status Steps */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: <Cpu size={16} />, label: 'Creating company', threshold: 30, color: 'text-primary' },
                { icon: <Users size={16} />, label: 'Hiring CEO', threshold: 60, color: 'text-accent' },
                { icon: <FileText size={16} />, label: 'Handing off goal', threshold: 85, color: 'text-amber' },
              ].map((step) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md border transition-colors ${
                    launchProgress >= step.threshold
                      ? 'bg-success/10 border-success/30 text-success'
                      : 'bg-elevated/50 border-border text-fg-muted'
                  }`}
                >
                  {launchProgress >= step.threshold ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : (
                    <span className={step.color}>{step.icon}</span>
                  )}
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Phase: Launched ───────────────────────────────────────────── */}
        {phase === 'launched' && (
          <div>
            <Bubble role="agent">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-success" />
                <p className="font-medium">Venture launched successfully!</p>
              </div>
              <p className="text-fg-muted">The CEO agent has received the goal document and is assembling the team. You can monitor progress from the Swarm, Conductor, or Canvas views.</p>
            </Bubble>

            <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-5 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Zap size={20} className="text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display">{idea.length > 60 ? idea.slice(0, 60) + '...' : idea}</h2>
                  <p className="text-xs text-fg-muted">Launched {new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">Navigate to</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => navigate('/swarm')}
                    className="p-4 rounded-lg bg-elevated/50 border border-border hover:border-primary/50 hover:bg-primary-muted/10 text-center transition-all group"
                  >
                    <Zap size={20} className="mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Swarm</span>
                    <p className="text-xs text-fg-muted mt-0.5">Agent activity</p>
                  </button>
                  <button
                    onClick={() => navigate('/conductor')}
                    className="p-4 rounded-lg bg-elevated/50 border border-border hover:border-accent/50 hover:bg-accent-muted/10 text-center transition-all group"
                  >
                    <Cpu size={20} className="mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Conductor</span>
                    <p className="text-xs text-fg-muted mt-0.5">Task orchestration</p>
                  </button>
                  <button
                    onClick={() => navigate('/canvas')}
                    className="p-4 rounded-lg bg-elevated/50 border border-border hover:border-amber/50 hover:bg-amber-muted/10 text-center transition-all group"
                  >
                    <FileText size={20} className="mx-auto mb-2 text-amber group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Canvas</span>
                    <p className="text-xs text-fg-muted mt-0.5">Visual workspace</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Start another venture */}
            <button
              onClick={() => {
                setPhase('idea');
                setIdea('');
                setChatMessages([]);
                setInterviewAnswers([]);
                setCurrentQuestionIndex(0);
                setRequirements([]);
                setGoalDocs(null);
                setUploadedFiles([]);
                setLaunchProgress(0);
              }}
              className="mt-4 px-4 py-2 text-sm text-fg-muted hover:text-fg transition-colors flex items-center gap-2"
            >
              <Lightbulb size={14} /> Start another venture
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
