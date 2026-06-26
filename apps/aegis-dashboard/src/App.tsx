import React, { useState } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { Badge } from '@vscp/ui';
import { Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Zap } from 'lucide-react';

const DOMAINS = [
  'security', 'performance', 'scalability', 'reliability', 'maintainability',
  'testability', 'usability', 'accessibility', 'data_integrity', 'api_design',
  'architecture', 'documentation', 'compliance', 'cost_efficiency',
];

const DOMAIN_LABELS: Record<string, string> = {
  security: 'Security', performance: 'Performance', scalability: 'Scalability',
  reliability: 'Reliability', maintainability: 'Maintainability', testability: 'Testability',
  usability: 'Usability', accessibility: 'Accessibility', data_integrity: 'Data Integrity',
  api_design: 'API Design', architecture: 'Architecture', documentation: 'Documentation',
  compliance: 'Compliance', cost_efficiency: 'Cost Efficiency',
};

// Demo findings
const DEMO_FINDINGS = [
  { id: 'f1', domain: 'security', severity: 'critical', description: 'JWT tokens stored in localStorage without rotation', confidence: 0.92, evidence: ['No token refresh mechanism', 'XSS vulnerability'] },
  { id: 'f2', domain: 'performance', severity: 'high', description: 'Canvas re-renders on every mouse move without throttling', confidence: 0.87, evidence: ['60fps target not met', 'React DevTools shows full tree re-render'] },
  { id: 'f3', domain: 'api_design', severity: 'medium', description: 'Inconsistent error response format across endpoints', confidence: 0.78, evidence: ['Some return {error}, others return {message}'] },
  { id: 'f4', domain: 'architecture', severity: 'low', description: 'Services share no common middleware pattern', confidence: 0.65, evidence: ['Each service has custom error handling'] },
];

function severityColor(s: string) {
  return s === 'critical' ? 'error' : s === 'high' ? 'warning' : s === 'medium' ? 'info' : 'neutral';
}

function domainScore(domain: string) {
  const hash = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.max(0.3, Math.min(1.0, (hash % 100) / 100));
}

export default function App() {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [auditTriggered, setAuditTriggered] = useState(false);

  return (
    <div className="relative min-h-screen text-fg z-10">
      <Atmosphere />
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-md border-b border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-accent" />
          <h1 className="text-lg font-bold">AEGIS Quality Gates</h1>
          <Badge variant="info">14 Domains</Badge>
        </div>
        <button
          onClick={() => setAuditTriggered(true)}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-dark transition-colors"
        >
          <Zap size={14} className="inline mr-1.5" />
          Run Audit
        </button>
      </header>

      <main className="pt-16 p-6 space-y-6">
        {/* Risk Heatmap */}
        <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="px-6 py-3 border-b border-border bg-elevated/60 backdrop-blur-sm">
            <h2 className="font-semibold text-sm">14-Domain Risk Heatmap</h2>
          </div>
          <div className="grid grid-cols-7 gap-2 p-4">
            {DOMAINS.map((domain) => {
              const score = domainScore(domain);
              const color = score >= 0.8 ? 'bg-success' : score >= 0.6 ? 'bg-warning' : 'bg-error';
              const isExpanded = expandedDomain === domain;
              return (
                <button
                  key={domain}
                  onClick={() => setExpandedDomain(isExpanded ? null : domain)}
                  className={`p-3 rounded-md border transition-all text-center ${
                    isExpanded ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border-hover'
                  }`}
                >
                  <div className={`w-full h-2 rounded-full ${color} mb-2`} style={{ opacity: score }} />
                  <p className="text-[10px] font-medium text-fg-secondary">{DOMAIN_LABELS[domain]}</p>
                  <p className="text-xs font-bold font-mono">{(score * 100).toFixed(0)}%</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Findings */}
        <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="px-6 py-3 border-b border-border bg-elevated/60 backdrop-blur-sm flex items-center justify-between">
            <h2 className="font-semibold text-sm">Findings ({DEMO_FINDINGS.length})</h2>
            <div className="flex gap-2">
              <Badge variant="danger">1 Critical</Badge>
              <Badge variant="warning">1 High</Badge>
              <Badge variant="info">1 Medium</Badge>
              <Badge variant="neutral">1 Low</Badge>
            </div>
          </div>
          <div className="divide-y divide-border">
            {DEMO_FINDINGS.map((finding) => (
              <div key={finding.id} className="px-6 py-4 hover:bg-hover/30 transition-colors">
                <div className="flex items-start gap-3">
                  <Badge variant={severityColor(finding.severity) as any}>{finding.severity}</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{finding.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-fg-muted">Domain: {DOMAIN_LABELS[finding.domain]}</span>
                      <span className="text-xs text-fg-muted">Confidence: {(finding.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {finding.evidence.map((e, i) => (
                        <p key={i} className="text-xs text-fg-muted pl-3 border-l-2 border-border">• {e}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Summary */}
        <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="px-6 py-3 border-b border-border bg-elevated/60 backdrop-blur-sm">
            <h2 className="font-semibold text-sm">Executive Summary</h2>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-sm text-fg-secondary">
              Overall risk score: <span className="font-bold text-warning">Medium-High</span>. The most critical finding is a JWT security vulnerability that should be addressed before any production deployment.
            </p>
            <p className="text-sm text-fg-secondary">
              Performance concerns around canvas re-rendering need attention but are not blocking. API consistency improvements are recommended for maintainability.
            </p>
            <div className="flex gap-2 pt-2">
              <Badge variant="warning" dot>2 blockers</Badge>
              <Badge variant="info" dot>5 recommendations</Badge>
              <Badge variant="success" dot>7 passing</Badge>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
