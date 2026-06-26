import React from 'react';
import { Badge } from '@vscp/ui';
import { Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

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

const DEMO_FINDINGS = [
  { id: 'f1', domain: 'security', severity: 'critical', description: 'JWT tokens stored in localStorage without rotation', confidence: 0.92 },
  { id: 'f2', domain: 'performance', severity: 'high', description: 'Canvas re-renders on every mouse move without throttling', confidence: 0.87 },
  { id: 'f3', domain: 'api_design', severity: 'medium', description: 'Inconsistent error response format across endpoints', confidence: 0.78 },
  { id: 'f4', domain: 'architecture', severity: 'low', description: 'Services share no common middleware pattern', confidence: 0.65 },
];

function severityColor(s: string) {
  return s === 'critical' ? 'error' : s === 'high' ? 'warning' : s === 'medium' ? 'info' : 'neutral';
}

function domainScore(domain: string) {
  const hash = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.max(0.3, Math.min(1.0, (hash % 100) / 100));
}

export function QualityPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-accent" />
          <h1 className="text-xl font-bold">Quality Gates</h1>
          <Badge variant="info">14 Domains</Badge>
        </div>
        <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-dark transition-colors">
          <Zap size={14} className="inline mr-1.5" /> Run Audit
        </button>
      </div>

      {/* Heatmap */}
      <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border mb-6">
        <div className="px-4 py-3 border-b border-border bg-elevated/60">
          <h2 className="font-semibold text-sm">Risk Heatmap</h2>
        </div>
        <div className="grid grid-cols-7 gap-2 p-4">
          {DOMAINS.map((domain) => {
            const score = domainScore(domain);
            const color = score >= 0.8 ? 'bg-success' : score >= 0.6 ? 'bg-warning' : 'bg-error';
            return (
              <div key={domain} className="p-3 rounded-md border border-border text-center">
                <div className={`w-full h-2 rounded-full ${color} mb-2`} style={{ opacity: score }} />
                <p className="text-[10px] font-medium text-fg-secondary">{DOMAIN_LABELS[domain]}</p>
                <p className="text-xs font-bold font-mono">{(score * 100).toFixed(0)}%</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Findings */}
      <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border">
        <div className="px-4 py-3 border-b border-border bg-elevated/60">
          <h2 className="font-semibold text-sm">Findings ({DEMO_FINDINGS.length})</h2>
        </div>
        <div className="divide-y divide-border">
          {DEMO_FINDINGS.map((f) => (
            <div key={f.id} className="px-6 py-4 hover:bg-hover/30">
              <div className="flex items-start gap-3">
                <Badge variant={severityColor(f.severity) as any}>{f.severity}</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{f.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-fg-muted">Domain: {DOMAIN_LABELS[f.domain]}</span>
                    <span className="text-xs text-fg-muted">Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
