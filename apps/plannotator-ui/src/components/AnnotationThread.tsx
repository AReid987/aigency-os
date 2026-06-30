import React, { useState } from 'react';
import { Badge } from '@aigency-os/ui';
import { MessageSquare, Send } from 'lucide-react';

interface Annotation {
  id: string;
  sectionId: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
}

interface AnnotationThreadProps {
  annotations: Annotation[];
  onAddAnnotation?: (content: string, sectionId: string) => void;
  sectionId?: string;
}

export function AnnotationThread({ annotations, onAddAnnotation, sectionId }: AnnotationThreadProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim() && sectionId) {
      onAddAnnotation?.(newComment.trim(), sectionId);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <MessageSquare size={14} className="text-accent" />
        Annotations ({annotations.length})
      </h3>

      {annotations.map((ann) => (
        <div key={ann.id} className="p-3 rounded-md bg-surface/70 border border-border">
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

      {onAddAnnotation && sectionId && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Add annotation..."
            className="flex-1 px-3 py-2 text-sm bg-hover/60 border border-border rounded-md focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-primary text-fg-inverse rounded-md hover:bg-primary-dark transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
