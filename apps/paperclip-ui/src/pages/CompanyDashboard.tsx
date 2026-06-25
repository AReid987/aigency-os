import React from 'react';
import { OrgChart } from '../components/OrgChart';
import { TicketBoard } from '../components/TicketBoard';
import { BudgetTracker } from '../components/BudgetTracker';
import { BoardActions } from '../components/BoardActions';
import type { Company, Agent, Ticket, Budget } from '@vscp/shared-types';

interface CompanyDashboardProps {
  company?: Company;
}

// Demo data for development
const DEMO_AGENTS: Agent[] = [
  { id: '1', name: 'Zeus', role: 'CEO', reportingTo: null, budgetLimit: 60, budgetSpent: 12, heartbeatSchedule: '4h', status: 'active', skills: [], adapter: 'hermes' },
  { id: '2', name: 'Hermes', role: 'CTO', reportingTo: '1', budgetLimit: 50, budgetSpent: 8, heartbeatSchedule: '4h', status: 'active', skills: [], adapter: 'hermes' },
  { id: '3', name: 'Claude', role: 'Engineer', reportingTo: '2', budgetLimit: 30, budgetSpent: 15, heartbeatSchedule: '8h', status: 'active', skills: [], adapter: 'claude' },
];

const DEMO_TICKETS: Ticket[] = [
  { id: '1', title: 'Auth system', description: 'Build JWT auth middleware', assigneeId: '3', status: 'in_progress', priority: 'P0', comments: [], createdAt: '', updatedAt: '' },
  { id: '2', title: 'Landing page', description: 'Design and build landing page', assigneeId: '2', status: 'done', priority: 'P1', comments: [], createdAt: '', updatedAt: '' },
  { id: '3', title: 'API schema', description: 'Define OpenAPI spec', assigneeId: '2', status: 'backlog', priority: 'P0', comments: [], createdAt: '', updatedAt: '' },
];

const DEMO_BUDGET: Budget = { total: 240, spent: 35, perAgent: { '1': { limit: 60, spent: 12 }, '2': { limit: 50, spent: 8 }, '3': { limit: 30, spent: 15 } } };

export function CompanyDashboard({ company }: CompanyDashboardProps) {
  const agents = company?.agents ?? DEMO_AGENTS;
  const tickets = DEMO_TICKETS;
  const budget = company?.budgets ?? DEMO_BUDGET;

  return (
    <div className="min-h-screen bg-bg bg-bg">
      <header className="border-b bg-surface bg-elevated px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{company?.name ?? 'Acme Ventures'}</h1>
            <p className="text-sm text-fg-muted">{company?.mission ?? 'Build the #1 AI note-taking app to $1M ARR'}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-white hover:bg-primary-dark">
              + Hire Agent
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md border hover:bg-bg dark:hover:bg-hover">
              Settings
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Org Chart */}
        <section className="bg-surface bg-elevated rounded-md border shadow-sm">
          <div className="px-6 py-3 border-b">
            <h2 className="font-semibold">Org Chart</h2>
          </div>
          <OrgChart agents={agents} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets */}
          <section className="lg:col-span-2 bg-surface bg-elevated rounded-md border shadow-sm">
            <div className="px-6 py-3 border-b">
              <h2 className="font-semibold">Active Tickets</h2>
            </div>
            <TicketBoard tickets={tickets} />
          </section>

          {/* Budget + Board */}
          <div className="space-y-6">
            <section className="bg-surface bg-elevated rounded-md border shadow-sm">
              <div className="px-6 py-3 border-b">
                <h2 className="font-semibold">Budget Overview</h2>
              </div>
              <BudgetTracker budget={budget} agents={agents} />
            </section>

            <section className="bg-surface bg-elevated rounded-md border shadow-sm">
              <div className="px-6 py-3 border-b">
                <h2 className="font-semibold">Board Actions</h2>
              </div>
              <BoardActions />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
