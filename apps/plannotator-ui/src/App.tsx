import React, { useState } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { PlanViewer } from './components/PlanViewer';

import { DiffViewer } from './components/DiffViewer';
import { SectionToggle } from './components/SectionToggle';
import { Badge } from '@vscp/ui';
import { FileText, GitCompare, MessageSquare, Shield } from 'lucide-react';

// Demo plans
const DEMO_PLANS = [
  {
    id: 'plan-1',
    title: 'Auth System Implementation',
    source: 'paperclip',
    version: 2,
    sections: [
      { id: 's1', title: 'Business Requirements', type: 'business' as const, content: 'Implement JWT-based authentication with role-based access control. Support domain expert and technical founder roles. Budget: $500, Timeline: 2 weeks.', access: ['domain_expert', 'technical_founder'] },
      { id: 's2', title: 'Technical Architecture', type: 'technical' as const, content: 'Fastify middleware with JWT validation. SQLite sessions store. RBAC middleware checks role permissions per route. Password hashing with bcrypt.', access: ['technical_founder'] },
      { id: 's3', title: 'API Design', type: 'technical' as const, content: 'POST /auth/login → JWT token\nPOST /auth/register → user creation\nGET /auth/me → current user\nPOST /auth/refresh → token refresh\nAll endpoints return structured errors.', access: ['technical_founder'] },
      { id: 's4', title: 'Testing Strategy', type: 'technical' as const, content: 'Unit tests for auth middleware (>80% coverage). Integration tests for login/register flows. E2E tests for RBAC enforcement.', access: ['technical_founder'] },
    ],
    annotations: [
      { id: 'a1', sectionId: 's1', author: 'Sarah Chen', role: 'domain_expert', content: 'Can we add social login (Google/GitHub)?', timestamp: new Date().toISOString() },
      { id: 'a2', sectionId: 's2', author: 'Agent C', role: 'technical_founder', content: 'Good idea. Will add OAuth2 flow in next iteration.', timestamp: new Date().toISOString() },
    ],
  },
  {
    id: 'plan-2',
    title: 'Revenue Dashboard MVP',
    source: 'paperclip',
    version: 1,
    sections: [
      { id: 's5', title: 'Business Requirements', type: 'business' as const, content: 'Build revenue tracking dashboard showing MRR, ARR, churn rate, and LTV/CAC ratios. Target: domain experts need real-time visibility.', access: ['domain_expert', 'technical_founder'] },
      { id: 's6', title: 'Technical Architecture', type: 'technical' as const, content: 'React dashboard with Zustand state. Real-time updates via WebSocket. Chart.js for visualizations. Data from Paperclip API budgets endpoint.', access: ['technical_founder'] },
    ],
    annotations: [],
  },
];

type Tab = 'review' | 'diff';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('review');
  const [selectedPlan, setSelectedPlan] = useState(DEMO_PLANS[0]);
  const [role, setRole] = useState<'domain_expert' | 'technical_founder'>('technical_founder');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const filteredSections = selectedPlan.sections.filter(
    (s) => s.access.includes(role)
  );

  return (
    <div className="relative min-h-screen text-fg z-10">
      <Atmosphere />
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-md border-b border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">Plannotator</h1>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'review' ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60 hover:text-fg'
              }`}
            >
              <FileText size={14} className="inline mr-1.5" />
              Plan Review
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'diff' ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60 hover:text-fg'
              }`}
            >
              <GitCompare size={14} className="inline mr-1.5" />
              Diff View
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SectionToggle role={role} onRoleChange={setRole} />
          <Badge variant={role === 'domain_expert' ? 'warning' : 'info'}>
            <Shield size={10} className="mr-1" />
            {role === 'domain_expert' ? 'Business Only' : 'Full Access'}
          </Badge>
        </div>
      </header>

      <main className="pt-14 p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-5rem)]">
          {/* Plan list sidebar */}
          <div className="col-span-3 bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-auto">
            <div className="px-4 py-3 border-b border-border bg-elevated/60 backdrop-blur-sm">
              <h2 className="font-semibold text-sm">Plans</h2>
              <p className="text-xs text-fg-muted mt-0.5">{DEMO_PLANS.length} plans</p>
            </div>
            <div className="p-2 space-y-1">
              {DEMO_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    selectedPlan.id === plan.id
                      ? 'bg-primary-muted border border-primary/30'
                      : 'hover:bg-hover/60 border border-transparent'
                  }`}
                >
                  <p className="text-sm font-medium">{plan.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="neutral">v{plan.version}</Badge>
                    <Badge variant="info">{plan.source}</Badge>
                    {plan.annotations.length > 0 && (
                      <span className="text-xs text-fg-muted flex items-center gap-0.5">
                        <MessageSquare size={10} /> {plan.annotations.length}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-9">
            {activeTab === 'review' ? (
              <PlanViewer
                plan={selectedPlan}
                sections={filteredSections}
                annotations={selectedPlan.annotations}
                role={role}
                selectedSection={selectedSection}
                onSectionSelect={setSelectedSection}
              />
            ) : (
              <DiffViewer plan={selectedPlan} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
