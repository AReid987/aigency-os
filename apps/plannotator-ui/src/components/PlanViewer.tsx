import React from 'react';
import { Badge } from '@vscp/ui';
import { ChevronDown, ChevronRight, Briefcase, Code, MessageSquare } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  type: 'business' | 'technical';
  content: string;
  access: string[];
}

interface Annotation {
  id: string;
  sectionId: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
}

interface PlanViewerProps {
  plan: { id: string; title: string; version: number; source: string };
  sections: Section[];
  annotations: Annotation[];
  role: string;
  selectedSection: string | null;
  onSectionSelect: (id: string | null) => void;
}

export function PlanViewer({ plan, sections, annotations, role, selectedSection, onSectionSelect }: PlanViewerProps) {
  return (
    <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] h-full overflow-auto">
      {/* Plan header */}
      <div className="px-6 py-4 border-b border-border bg-elevated/60 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{plan.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="neutral">Version {plan.version}</Badge>
              <Badge variant="info">Source: {plan.source}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="p-6 space-y-4">
        {sections.map((section) => {
          const isExpanded = selectedSection === section.id;
          const sectionAnnotations = annotations.filter((a) => a.sectionId === section.id);
          const isBusiness = section.type === 'business';

          return (
            <div
              key={section.id}
              className={`rounded-md border transition-colors ${
                isExpanded ? 'border-primary/40 bg-elevated/50' : 'border-border hover:border-border-hover'
              }`}
            >
              <button
                onClick={() => onSectionSelect(isExpanded ? null : section.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {isBusiness ? (
                    <span className="text-amber"><Briefcase size={16} /></span>
                  ) : (
                    <span className="text-primary"><Code size={16} /></span>
                  )}
                  <span className="font-semibold text-sm">{section.title}</span>
                  <Badge variant={isBusiness ? 'warning' : 'info'}>
                    {isBusiness ? 'Business' : 'Technical'}
                  </Badge>
                </div>
                {sectionAnnotations.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-fg-muted">
                    <MessageSquare size={12} /> {sectionAnnotations.length}
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="p-4 rounded-md bg-hover/40 backdrop-blur-sm border border-border">
                    <p className="text-sm text-fg-secondary leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>

                  {/* Annotations for this section */}
                  {sectionAnnotations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
                        Annotations
                      </h4>
                      {sectionAnnotations.map((ann) => (
                        <div
                          key={ann.id}
                          className="p-3 rounded-md bg-surface/70 border border-border"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-primary">{ann.author}</span>
                            <Badge variant={ann.role === 'domain_expert' ? 'warning' : 'info'}>{ann.role}</Badge>
                            <span className="text-xs text-fg-muted">
                              {new Date(ann.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-fg-secondary">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {sections.length === 0 && (
          <div className="text-center py-12 text-fg-muted">
            No sections visible for your current role. Switch to Technical Founder for full access.
          </div>
        )}
      </div>
    </div>
  );
}
