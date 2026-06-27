import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import { FileText, ChevronDown, ChevronRight, Briefcase, Code, MessageSquare, CheckCircle, XCircle, Send, Loader } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { plannotatorApi } from '../api/services';

// ─── Demo fallback data ──────────────────────────────────────────────────────

const DEMO_PLANS = [
  {
    id: 'plan-1', title: 'Auth System Implementation', version: 2, source: 'paperclip',
    sections: [
      { id: 's1', title: 'Business Requirements', type: 'business', content: 'Implement JWT-based authentication with role-based access control. Support domain expert and technical founder roles. Budget: $500, Timeline: 2 weeks.', access: ['domain_expert', 'technical_founder', 'admin'] },
      { id: 's2', title: 'Technical Architecture', type: 'technical', content: 'Fastify middleware with JWT validation. SQLite sessions store. RBAC middleware checks role permissions per route.', access: ['technical_founder', 'admin'] },
      { id: 's3', title: 'API Design', type: 'technical', content: 'POST /auth/login → JWT token\nPOST /auth/register → user creation\nGET /auth/me → current user', access: ['technical_founder', 'admin'] },
    ],
    annotations: [
      { id: 'a1', sectionId: 's1', author: 'Sarah Chen', content: 'Can we add social login?', timestamp: new Date().toISOString() },
    ],
    status: 'pending' as const,
  },
  {
    id: 'plan-2', title: 'Revenue Dashboard MVP', version: 1, source: 'paperclip',
    sections: [
      { id: 's4', title: 'Business Requirements', type: 'business', content: 'Build revenue tracking dashboard showing MRR, ARR, churn rate.', access: ['domain_expert', 'technical_founder', 'admin'] },
      { id: 's5', title: 'Technical Architecture', type: 'technical', content: 'React dashboard with Zustand state. Chart.js for visualizations.', access: ['technical_founder', 'admin'] },
    ],
    annotations: [],
    status: 'approved' as const,
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlanSection {
  id: string;
  title: string;
  type: string;
  content: string;
  access: string[];
}

interface Annotation {
  id: string;
  sectionId: string;
  author: string;
  content: string;
  timestamp: string;
}

interface Plan {
  id: string;
  title: string;
  version: number;
  source: string;
  sections: PlanSection[];
  annotations: Annotation[];
  status: 'pending' | 'approved' | 'rejected';
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PlannerPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-1');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationSectionId, setAnnotationSectionId] = useState<string | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // ── Fetch plans from API, fallback to demo ────────────────────────────────

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      try {
        const res = await plannotatorApi.getPlans();
        const plans = (res as any).plans ?? res;
        if (Array.isArray(plans) && plans.length > 0) {
          setUsingDemo(false);
          return plans as Plan[];
        }
        setUsingDemo(true);
        return DEMO_PLANS as Plan[];
      } catch {
        setUsingDemo(true);
        return DEMO_PLANS as Plan[];
      }
    },
    staleTime: 30_000,
  });

  const plans = plansData ?? DEMO_PLANS;

  const selectedPlan = plans.find((p: Plan) => p.id === selectedPlanId) ?? plans[0];

  // ── Mutations ─────────────────────────────────────────────────────────────

  const approveMutation = useMutation({
    mutationFn: (id: string) => plannotatorApi.approvePlan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => plannotatorApi.rejectPlan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  const annotationMutation = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: unknown }) =>
      plannotatorApi.addAnnotation(planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setAnnotationText('');
      setAnnotationSectionId(null);
    },
  });

  // ── Derived ───────────────────────────────────────────────────────────────

  const isTech = user?.role === 'admin' || user?.role === 'technical_founder';
  const filteredSections = (selectedPlan?.sections ?? []).filter((s: PlanSection) =>
    s.access.includes(user?.role || 'domain_expert')
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleApprove = () => {
    if (!selectedPlan) return;
    if (usingDemo) {
      // Demo mode — no API call
      return;
    }
    approveMutation.mutate(selectedPlan.id);
  };

  const handleReject = () => {
    if (!selectedPlan) return;
    if (usingDemo) return;
    rejectMutation.mutate(selectedPlan.id);
  };

  const handleAddAnnotation = () => {
    if (!selectedPlan || !annotationText.trim()) return;
    annotationMutation.mutate({
      planId: selectedPlan.id,
      data: {
        sectionId: annotationSectionId || null,
        content: annotationText.trim(),
        author: user?.name || 'Anonymous',
      },
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-primary" />
          <h1 className="text-xl font-bold">Plan Review</h1>
          {usingDemo && (
            <Badge variant="warning">Demo Mode — API unreachable</Badge>
          )}
        </div>
        <Badge variant={isTech ? 'info' : 'warning'}>{isTech ? 'Full Access' : 'Business Only'}</Badge>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-5rem)]">
        {/* ── Plan list sidebar ────────────────────────────────────────────── */}
        <div className="col-span-3 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 sticky top-0">
            <h2 className="font-semibold text-sm">Plans</h2>
          </div>
          <div className="p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader size={20} className="animate-spin text-primary" />
              </div>
            ) : (
              plans.map((plan: Plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${selectedPlanId === plan.id ? 'bg-primary-muted border border-primary/30' : 'hover:bg-hover/60 border border-transparent'}`}
                >
                  <p className="text-sm font-medium">{plan.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="neutral">v{plan.version}</Badge>
                    <Badge variant={plan.status === 'approved' ? 'success' : plan.status === 'rejected' ? 'danger' : 'warning'}>
                      {plan.status}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Plan detail ──────────────────────────────────────────────────── */}
        <div className="col-span-9 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
          {selectedPlan ? (
            <>
              <div className="px-6 py-4 border-b border-border bg-elevated/60 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selectedPlan.title}</h2>
                  <span className="text-xs text-fg-muted">Source: {selectedPlan.source}</span>
                </div>
                {selectedPlan.status === 'pending' && !usingDemo && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleApprove}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm bg-success/20 text-success hover:bg-success/30 disabled:opacity-50"
                    >
                      {approveMutation.isPending ? <Loader size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                      Approve Plan
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={rejectMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm bg-error/20 text-error hover:bg-error/30 disabled:opacity-50"
                    >
                      {rejectMutation.isPending ? <Loader size={12} className="animate-spin" /> : <XCircle size={12} />}
                      Reject Plan
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                {/* Sections */}
                {filteredSections.map((section: PlanSection) => {
                  const isExpanded = expandedSection === section.id;
                  const isBusiness = section.type === 'business';
                  return (
                    <div
                      key={section.id}
                      className={`rounded-md border transition-colors ${isExpanded ? 'border-primary/40 bg-elevated/50' : 'border-border hover:border-border-hover'}`}
                    >
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          {isBusiness ? <Briefcase size={16} className="text-amber" /> : <Code size={16} className="text-primary" />}
                          <span className="font-semibold text-sm">{section.title}</span>
                          <Badge variant={isBusiness ? 'warning' : 'info'}>{section.type}</Badge>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <div className="p-4 rounded-md bg-hover/40 border border-border">
                            <p className="text-sm text-fg-secondary whitespace-pre-wrap">{section.content}</p>
                          </div>
                          {selectedPlan.status === 'pending' && isBusiness && !usingDemo && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={handleApprove}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm bg-success/20 text-success hover:bg-success/30"
                              >
                                <CheckCircle size={12} /> Approve
                              </button>
                              <button
                                onClick={handleReject}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm bg-error/20 text-error hover:bg-error/30"
                              >
                                <XCircle size={12} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Existing annotations */}
                {selectedPlan.annotations?.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3 flex items-center gap-1">
                      <MessageSquare size={12} /> Annotations ({selectedPlan.annotations.length})
                    </h3>
                    {selectedPlan.annotations.map((a: Annotation) => (
                      <div key={a.id} className="mb-2 p-3 rounded-md bg-hover/40 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary">{a.author}</span>
                          <span className="text-xs text-fg-muted">{new Date(a.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-fg-secondary">{a.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add annotation form */}
                {!usingDemo && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
                      Add Annotation
                    </h3>
                    <div className="flex gap-2">
                      <select
                        value={annotationSectionId || ''}
                        onChange={(e) => setAnnotationSectionId(e.target.value || null)}
                        className="px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm"
                      >
                        <option value="">General</option>
                        {selectedPlan.sections?.map((s: PlanSection) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                      <input
                        value={annotationText}
                        onChange={(e) => setAnnotationText(e.target.value)}
                        placeholder="Write an annotation..."
                        className="flex-1 px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddAnnotation()}
                      />
                      <button
                        onClick={handleAddAnnotation}
                        disabled={!annotationText.trim() || annotationMutation.isPending}
                        className="px-3 py-2 bg-primary text-fg-inverse rounded-md hover:bg-primary-dark disabled:opacity-50"
                      >
                        {annotationMutation.isPending ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-fg-muted">Select a plan</div>
          )}
        </div>
      </div>
    </div>
  );
}
