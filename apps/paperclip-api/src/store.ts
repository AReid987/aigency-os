import type {
  Company,
  Agent,
  Goal,
  Task,
  Ticket,
  TicketComment,
  Budget,
  AuditEntry,
  AgentStatus,
  AgentAdapter,
  AgentRole,
  HeartbeatSchedule,
} from '@aigency-os/shared-types';

// ─── Board Decision ───────────────────────────────────────────────────────

export interface BoardDecision {
  id: string;
  companyId: string;
  decisionType: 'hire' | 'strategy' | 'budget' | 'termination' | 'other';
  decisionId: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  createdAt: string;
  resolvedAt: string | null;
}

// ─── In-Memory Store ──────────────────────────────────────────────────────

class Store {
  companies = new Map<string, Company>();
  agents = new Map<string, Agent>();
  goals = new Map<string, Goal>();
  tasks = new Map<string, Task>();
  tickets = new Map<string, Ticket>();
  boardDecisions = new Map<string, BoardDecision>();
  auditLog = new Map<string, AuditEntry[]>(); // companyId -> entries

  // ─── Company Methods ──────────────────────────────────────────────────

  createCompany(data: { name: string; mission: string; goal: string }): Company {
    const id = crypto.randomUUID();
    const goalId = crypto.randomUUID();
    const ceoAgentId = crypto.randomUUID();

    const initialGoal: Goal = {
      id: goalId,
      companyId: id,
      parentGoalId: null,
      title: data.goal,
      description: '',
      status: 'backlog',
      priority: 'P0',
      tasks: [],
    };

    const ceoAgent: Agent = {
      id: ceoAgentId,
      name: 'CEO',
      role: 'CEO' as AgentRole,
      reportingTo: null,
      budgetLimit: 0,
      budgetSpent: 0,
      heartbeatSchedule: 'continuous' as HeartbeatSchedule,
      status: 'active' as AgentStatus,
      skills: [],
      adapter: 'hermes' as AgentAdapter,
    };

    const company: Company = {
      id,
      name: data.name,
      mission: data.mission,
      goals: [initialGoal],
      agents: [ceoAgent],
      projects: [],
      budgets: { total: 0, spent: 0, perAgent: {} },
      auditLog: [],
    };

    this.companies.set(id, company);
    this.goals.set(goalId, initialGoal);
    this.agents.set(ceoAgentId, ceoAgent);
    this.auditLog.set(id, []);

    return company;
  }

  getCompany(id: string): Company | undefined {
    return this.companies.get(id);
  }

  listCompanies(): Company[] {
    return Array.from(this.companies.values());
  }

  updateCompany(id: string, data: Partial<Pick<Company, 'name' | 'mission'>>): Company | undefined {
    const company = this.companies.get(id);
    if (!company) return undefined;
    if (data.name !== undefined) company.name = data.name;
    if (data.mission !== undefined) company.mission = data.mission;
    return company;
  }

  deleteCompany(id: string): boolean {
    const company = this.companies.get(id);
    if (!company) return false;
    // Clean up related data
    for (const agent of company.agents) {
      this.agents.delete(agent.id);
    }
    for (const goal of company.goals) {
      this.goals.delete(goal.id);
      for (const task of goal.tasks) {
        this.tasks.delete(task.id);
      }
    }
    this.auditLog.delete(id);
    this.companies.delete(id);
    return true;
  }

  // ─── Agent Methods ────────────────────────────────────────────────────

  hireAgent(companyId: string, data: {
    name: string;
    role: AgentRole;
    adapter: AgentAdapter;
    budget: number;
    reportingTo?: string | null;
    heartbeatSchedule?: HeartbeatSchedule;
  }): Agent | undefined {
    const company = this.companies.get(companyId);
    if (!company) return undefined;

    const agent: Agent = {
      id: crypto.randomUUID(),
      name: data.name,
      role: data.role,
      reportingTo: data.reportingTo ?? null,
      budgetLimit: data.budget,
      budgetSpent: 0,
      heartbeatSchedule: data.heartbeatSchedule ?? '8h',
      status: 'active' as AgentStatus,
      skills: [],
      adapter: data.adapter,
    };

    company.agents.push(agent);
    this.agents.set(agent.id, agent);
    company.budgets.total += data.budget;
    company.budgets.perAgent[agent.id] = { limit: data.budget, spent: 0 };

    this.addAuditEntry(companyId, {
      action: 'agent_hired',
      actor: 'system',
      details: { agentId: agent.id, name: agent.name, role: agent.role },
    });

    return agent;
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  listAgents(companyId: string): Agent[] {
    const company = this.companies.get(companyId);
    return company?.agents ?? [];
  }

  updateAgentStatus(agentId: string, status: AgentStatus): Agent | undefined {
    const agent = this.agents.get(agentId);
    if (!agent) return undefined;
    agent.status = status;
    return agent;
  }

  // ─── Goal Methods ─────────────────────────────────────────────────────

  createGoal(companyId: string, data: {
    title: string;
    description?: string;
    parentGoalId?: string | null;
    priority?: 'P0' | 'P1' | 'P2';
  }): Goal | undefined {
    const company = this.companies.get(companyId);
    if (!company) return undefined;

    // Validate parent goal exists in same company if provided
    if (data.parentGoalId) {
      const parentGoal = this.goals.get(data.parentGoalId);
      if (!parentGoal || parentGoal.companyId !== companyId) return undefined;
    }

    const goal: Goal = {
      id: crypto.randomUUID(),
      companyId,
      parentGoalId: data.parentGoalId ?? null,
      title: data.title,
      description: data.description ?? '',
      status: 'backlog',
      priority: data.priority ?? 'P1',
      tasks: [],
    };

    company.goals.push(goal);
    this.goals.set(goal.id, goal);

    this.addAuditEntry(companyId, {
      action: 'goal_created',
      actor: 'system',
      details: { goalId: goal.id, title: goal.title, parentGoalId: goal.parentGoalId },
    });

    return goal;
  }

  getGoal(goalId: string): Goal | undefined {
    return this.goals.get(goalId);
  }

  listGoals(companyId: string): Goal[] {
    const company = this.companies.get(companyId);
    return company?.goals ?? [];
  }

  updateGoalStatus(goalId: string, status: Goal['status']): Goal | undefined {
    const goal = this.goals.get(goalId);
    if (!goal) return undefined;
    goal.status = status;
    return goal;
  }

  getGoalAncestry(goalId: string): string[] {
    const chain: string[] = [];
    let current = this.goals.get(goalId);
    while (current) {
      chain.push(current.title);
      current = current.parentGoalId ? this.goals.get(current.parentGoalId) : undefined;
    }
    return chain;
  }

  // ─── Task Methods ─────────────────────────────────────────────────────

  createTask(companyId: string, data: {
    goalId: string;
    assigneeId: string;
    title: string;
    description?: string;
    acceptanceCriteria?: string[];
  }): Task | undefined {
    const company = this.companies.get(companyId);
    if (!company) return undefined;

    const goal = this.goals.get(data.goalId);
    if (!goal || goal.companyId !== companyId) return undefined;

    const agent = this.agents.get(data.assigneeId);
    if (!agent) return undefined;

    const contextChain = this.getGoalAncestry(data.goalId);

    const task: Task = {
      id: crypto.randomUUID(),
      goalId: data.goalId,
      assigneeId: data.assigneeId,
      title: data.title,
      description: data.description ?? '',
      acceptanceCriteria: data.acceptanceCriteria ?? [],
      status: 'backlog',
      contextChain,
      toolCalls: [],
      auditTrail: [],
    };

    goal.tasks.push(task);
    this.tasks.set(task.id, task);

    this.addAuditEntry(companyId, {
      action: 'task_created',
      actor: 'system',
      details: { taskId: task.id, goalId: data.goalId, assigneeId: data.assigneeId, title: task.title },
    });

    return task;
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  updateTaskStatus(taskId: string, status: Task['status']): Task | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;
    task.status = status;
    return task;
  }

  // ─── Ticket Methods ───────────────────────────────────────────────────

  createTicket(companyId: string, data: {
    title: string;
    description?: string;
    assigneeId: string;
    priority?: 'P0' | 'P1' | 'P2';
  }): Ticket | undefined {
    const company = this.companies.get(companyId);
    if (!company) return undefined;

    const agent = this.agents.get(data.assigneeId);
    if (!agent) return undefined;

    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description ?? '',
      assigneeId: data.assigneeId,
      status: 'backlog',
      priority: data.priority ?? 'P1',
      comments: [],
      createdAt: now,
      updatedAt: now,
    };

    this.tickets.set(ticket.id, ticket);

    this.addAuditEntry(companyId, {
      action: 'ticket_created',
      actor: 'system',
      details: { ticketId: ticket.id, title: ticket.title, assigneeId: data.assigneeId },
    });

    return ticket;
  }

  getTicket(ticketId: string): Ticket | undefined {
    return this.tickets.get(ticketId);
  }

  listTickets(companyId: string): Ticket[] {
    const company = this.companies.get(companyId);
    if (!company) return [];
    const agentIds = new Set(company.agents.map(a => a.id));
    return Array.from(this.tickets.values()).filter(t => agentIds.has(t.assigneeId));
  }

  updateTicketStatus(ticketId: string, status: Ticket['status']): Ticket | undefined {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return undefined;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  addTicketComment(ticketId: string, data: { authorId: string; content: string }): TicketComment | undefined {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return undefined;

    const comment: TicketComment = {
      id: crypto.randomUUID(),
      authorId: data.authorId,
      content: data.content,
      timestamp: new Date().toISOString(),
    };

    ticket.comments.push(comment);
    ticket.updatedAt = new Date().toISOString();
    return comment;
  }

  // ─── Budget Methods ───────────────────────────────────────────────────

  getBudget(companyId: string): Budget | undefined {
    const company = this.companies.get(companyId);
    return company?.budgets;
  }

  recordSpend(companyId: string, agentId: string, amount: number): {
    success: boolean;
    warning?: 'soft' | 'hard';
    message?: string;
  } {
    const company = this.companies.get(companyId);
    if (!company) return { success: false, message: 'Company not found' };

    const agent = this.agents.get(agentId);
    if (!agent) return { success: false, message: 'Agent not found' };

    const agentBudget = company.budgets.perAgent[agentId];
    if (!agentBudget) return { success: false, message: 'No budget allocated' };

    const newSpent = agentBudget.spent + amount;
    const percentUsed = (newSpent / agentBudget.limit) * 100;

    // Hard stop at 100%
    if (percentUsed >= 100) {
      agent.status = 'paused' as AgentStatus;
      agentBudget.spent = newSpent;
      agent.budgetSpent = newSpent;
      company.budgets.spent += amount;

      this.addAuditEntry(companyId, {
        action: 'budget_hard_stop',
        actor: 'system',
        details: { agentId, spent: newSpent, limit: agentBudget.limit, percentUsed },
      });

      return {
        success: false,
        warning: 'hard',
        message: `Agent ${agent.name} auto-paused: budget exhausted (${percentUsed.toFixed(1)}%)`,
      };
    }

    // Soft warning at 80%
    agentBudget.spent = newSpent;
    agent.budgetSpent = newSpent;
    company.budgets.spent += amount;

    if (percentUsed >= 80) {
      this.addAuditEntry(companyId, {
        action: 'budget_soft_warning',
        actor: 'system',
        details: { agentId, spent: newSpent, limit: agentBudget.limit, percentUsed },
      });

      return {
        success: true,
        warning: 'soft',
        message: `Agent ${agent.name} at ${percentUsed.toFixed(1)}% budget usage`,
      };
    }

    return { success: true };
  }

  // ─── Heartbeat Methods ────────────────────────────────────────────────

  heartbeat(companyId: string, agentId: string): {
    pendingTasks: Task[];
    budget: { limit: number; spent: number; percentUsed: number };
    goalAncestry: string[];
  } | undefined {
    const company = this.companies.get(companyId);
    if (!company) return undefined;

    const agent = this.agents.get(agentId);
    if (!agent) return undefined;

    // Find pending tasks assigned to this agent
    const pendingTasks = Array.from(this.tasks.values()).filter(
      t => t.assigneeId === agentId && t.status !== 'done' && t.status !== 'rejected'
    );

    const agentBudget = company.budgets.perAgent[agentId] ?? { limit: 0, spent: 0 };
    const percentUsed = agentBudget.limit > 0 ? (agentBudget.spent / agentBudget.limit) * 100 : 0;

    // Get goal ancestry from first pending task
    const goalAncestry = pendingTasks.length > 0
      ? this.getGoalAncestry(pendingTasks[0].goalId)
      : [company.mission];

    return {
      pendingTasks,
      budget: {
        limit: agentBudget.limit,
        spent: agentBudget.spent,
        percentUsed,
      },
      goalAncestry,
    };
  }

  // ─── Board Methods ────────────────────────────────────────────────────

  submitDecision(companyId: string, data: {
    decisionType: BoardDecision['decisionType'];
    decisionId: string;
    approval: 'approve' | 'reject';
    notes?: string;
  }): BoardDecision | undefined {
    const company = this.companies.get(companyId);
    if (!company) return undefined;

    const decision: BoardDecision = {
      id: crypto.randomUUID(),
      companyId,
      decisionType: data.decisionType,
      decisionId: data.decisionId,
      status: data.approval === 'approve' ? 'approved' : 'rejected',
      notes: data.notes ?? '',
      createdAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
    };

    this.boardDecisions.set(decision.id, decision);

    this.addAuditEntry(companyId, {
      action: `board_${data.approval}`,
      actor: 'board',
      details: {
        decisionId: decision.id,
        decisionType: data.decisionType,
        targetId: data.decisionId,
        approval: data.approval,
      },
    });

    return decision;
  }

  listDecisions(companyId: string): BoardDecision[] {
    return Array.from(this.boardDecisions.values()).filter(d => d.companyId === companyId);
  }

  // ─── Dashboard Methods ────────────────────────────────────────────────

  getDashboard(companyId: string): {
    org_chart: Agent[];
    budgets: Budget;
    active_tasks: Task[];
    audit_log: AuditEntry[];
    tickets: Ticket[];
    goals: Goal[];
  } | undefined {
    const company = this.companies.get(companyId);
    if (!company) return undefined;

    const activeTasks = Array.from(this.tasks.values()).filter(
      t => company.agents.some(a => a.id === t.assigneeId) && t.status !== 'done' && t.status !== 'rejected'
    );

    const tickets = this.listTickets(companyId);
    const auditLog = this.auditLog.get(companyId) ?? [];

    return {
      org_chart: company.agents,
      budgets: company.budgets,
      active_tasks: activeTasks,
      audit_log: auditLog,
      tickets,
      goals: company.goals,
    };
  }

  // ─── Audit Methods ────────────────────────────────────────────────────

  addAuditEntry(companyId: string, entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
    const fullEntry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry,
    };

    const log = this.auditLog.get(companyId) ?? [];
    log.push(fullEntry);
    this.auditLog.set(companyId, log);

    const company = this.companies.get(companyId);
    if (company) {
      company.auditLog.push(fullEntry);
    }

    return fullEntry;
  }

  getAuditLog(companyId: string): AuditEntry[] {
    return this.auditLog.get(companyId) ?? [];
  }
}

export const store = new Store();
