import React from 'react';
import type { Budget, Agent } from '@vscp/shared-types';

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
          <span className="text-gray-500">
            ${budget.spent.toFixed(2)} / ${budget.total.toFixed(2)} ({totalPercent}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full rounded-full transition-all ${
              totalPercent >= 90 ? 'bg-red-500' : totalPercent >= 70 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(totalPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Per-agent budgets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Per-Agent Breakdown</h4>
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
                <span className={isOver ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                  ${agentBudget.spent.toFixed(2)} / ${agentBudget.limit.toFixed(2)}
                  {isWarning && !isOver && ' ⚠️'}
                  {isOver && ' 🛑'}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOver ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
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
