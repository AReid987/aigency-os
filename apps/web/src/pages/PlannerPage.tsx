import React, { useState } from 'react';
import { Badge } from '@vscp/ui';
import { FileText, ChevronDown, ChevronRight, Briefcase, Code, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

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

export function PlannerPage() {
  const [selectedPlan, setSelectedPlan] = useState(DEMO_PLANS[0]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const isTech = user?.role === 'admin' || user?.role === 'technical_founder';

  const filteredSections = selectedPlan.sections.filter((s) => s.access.includes(user?.role || 'domain_expert'));

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-primary" />
          <h1 className="text-xl font-bold">Plan Review</h1>
        </div>
        <Badge variant={isTech ? 'info' : 'warning'}>{isTech ? 'Full Access' : 'Business Only'}</Badge>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-5rem)]">
        <div className="col-span-3 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 sticky top-0">
            <h2 className="font-semibold text-sm">Plans</h2>
          </div>
          <div className="p-2 space-y-1">
            {DEMO_PLANS.map((plan) => (
              <button key={plan.id} onClick={() => setSelectedPlan(plan)} className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${selectedPlan.id === plan.id ? 'bg-primary-muted border border-primary/30' : 'hover:bg-hover/60 border border-transparent'}`}>
                <p className="text-sm font-medium">{plan.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="neutral">v{plan.version}</Badge>
                  <Badge variant={plan.status === 'approved' ? 'success' : 'warning'}>{plan.status}</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-9 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
          <div className="px-6 py-4 border-b border-border bg-elevated/60">
            <h2 className="text-lg font-bold">{selectedPlan.title}</h2>
          </div>
          <div className="p-6 space-y-4">
            {filteredSections.map((section) => {
              const isExpanded = expandedSection === section.id;
              const isBusiness = section.type === 'business';
              return (
                <div key={section.id} className={`rounded-md border transition-colors ${isExpanded ? 'border-primary/40 bg-elevated/50' : 'border-border hover:border-border-hover'}`}>
                  <button onClick={() => setExpandedSection(isExpanded ? null : section.id)} className="w-full flex items-center justify-between px-4 py-3 text-left">
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
                      {selectedPlan.status === 'pending' && isBusiness && (
                        <div className="flex gap-2 mt-3">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm bg-success/20 text-success hover:bg-success/30">
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-sm bg-error/20 text-error hover:bg-error/30">
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
