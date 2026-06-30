import React from 'react';
import type { Budget, Agent } from '@aigency-os/shared-types';
import { AlertTriangle, OctagonAlert } from 'lucide-react';

interface BudgetTrackerProps {
  budget: Budget;
  agents: Agent[];
}

export function BudgetTracker({ budget, agents }: BudgetTrackerProps) {
  const totalPercent = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;

  return (
    <div className="p-4 space-y-4">
      {/* Total budget */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Total Budget</span>
          <span className="text-fg-muted">
            ${budget.spent.toFixed(2)} / ${budget.total.toFixed(2)} ({totalPercent}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-hover/60 backdrop-blur-sm">
          <div
            className={`h-full rounded-full transition-all ${
              totalPercent >= 90 ? 'bg-error' : totalPercent >= 70 ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(totalPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Per-agent budgets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-fg-muted">Per-Agent Breakdown</h4>
        {agents.map((agent) => {
          const agentBudget = budget.perAgent[agent.id];
          if (!agentBudget || agentBudget.limit === 0) return null;
          const percent = Math.round((agentBudget.spent / agentBudget.limit) * 100);
          const isWarning = percent >= 80;
          const isOver = percent >= 100;

          return (
            <div key={agent.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{agent.name} ({agent.role})</span>
                <span className={`flex items-center gap-1 ${isOver ? 'text-error font-semibold' : 'text-fg-muted'}`}>
                  ${agentBudget.spent.toFixed(2)} / ${agentBudget.limit.toFixed(2)}
                  {isWarning && !isOver && <AlertTriangle size={12} className="text-warning" />}
                  {isOver && <OctagonAlert size={12} className="text-error" />}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-hover/60 backdrop-blur-sm">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOver ? 'bg-error' : isWarning ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
