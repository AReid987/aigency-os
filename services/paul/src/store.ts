// ─── Domain Types ──────────────────────────────────────────────────────────

export interface AcceptanceCriterion {
  id: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  acceptanceCriteria: AcceptanceCriterion[];
}

export interface Plan {
  id: string;
  prd: string;
  title: string;
  summary: string;
  tasks: Task[];
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TechSpecSection {
  title: string;
  content: string;
}

export interface TechSpec {
  planId: string;
  generatedAt: string;
  sections: TechSpecSection[];
}

// ─── PRD Parser ────────────────────────────────────────────────────────────

function generateTasksFromPRD(prd: string): { title: string; summary: string; tasks: Task[] } {
  const lower = prd.toLowerCase();

  // Generate contextual tasks based on PRD keywords
  const taskTemplates: Array<{
    title: string;
    description: string;
    criteria: string[];
    keywords: string[];
  }> = [
    {
      title: 'Design system architecture',
      description: 'Define the high-level architecture, component boundaries, and data flow for the feature.',
      criteria: [
        'Architecture diagram created and reviewed',
        'Component interfaces documented',
        'Data flow paths identified and validated',
      ],
      keywords: ['architect', 'design', 'system', 'component', 'microservice', 'service'],
    },
    {
      title: 'Implement core data model',
      description: 'Define and implement the core data models, database schemas, and data access layer.',
      criteria: [
        'Database schema defined with proper migrations',
        'CRUD operations implemented and tested',
        'Data validation rules enforced at model level',
      ],
      keywords: ['data', 'model', 'database', 'schema', 'entity', 'crud', 'auth', 'user', 'account'],
    },
    {
      title: 'Build API endpoints',
      description: 'Implement the REST/GraphQL API endpoints with proper request validation and error handling.',
      criteria: [
        'All endpoints return correct status codes and payloads',
        'Input validation using schema validation (e.g., Zod)',
        'Error responses follow consistent format',
      ],
      keywords: ['api', 'endpoint', 'rest', 'graphql', 'route', 'http', 'request', 'login', 'register', 'session'],
    },
    {
      title: 'Implement authentication & authorization',
      description: 'Add authentication middleware and role-based access control to protect endpoints.',
      criteria: [
        'Unauthenticated requests are rejected with 401',
        'Role-based access control enforced on protected routes',
        'Token/session lifecycle managed correctly',
      ],
      keywords: ['auth', 'login', 'token', 'jwt', 'session', 'permission', 'role', 'access', 'security', 'password'],
    },
    {
      title: 'Add integration tests and documentation',
      description: 'Write integration tests covering happy paths and edge cases, and document the API.',
      criteria: [
        'Integration tests cover all API endpoints',
        'Edge cases and error scenarios tested',
        'API documentation generated and up-to-date',
      ],
      keywords: ['test', 'documentation', 'docs', 'integration', 'e2e'],
    },
  ];

  // Score tasks by keyword relevance
  const scored = taskTemplates.map((t) => {
    const score = t.keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    return { ...t, score };
  });

  // Sort by score descending, pick top 3-5 (always at least 3)
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, Math.max(3, Math.min(5, scored.filter((s) => s.score > 0).length || 3)));

  // If no keywords matched, just take the first 3
  const tasks: Task[] = selected.map((t, idx) => ({
    id: crypto.randomUUID(),
    title: t.title,
    description: t.description,
    status: 'pending' as const,
    acceptanceCriteria: t.criteria.map((desc) => ({
      id: crypto.randomUUID(),
      description: desc,
      status: 'pending' as const,
    })),
  }));

  // Generate title and summary from PRD
  const firstSentence = prd.split(/[.!?\n]/)[0]?.trim() || prd;
  const title = firstSentence.length > 80 ? firstSentence.slice(0, 77) + '...' : firstSentence;
  const summary = `Implementation plan for: ${firstSentence}. This plan covers ${tasks.length} tasks with ${tasks.reduce((acc, t) => acc + t.acceptanceCriteria.length, 0)} acceptance criteria.`;

  return { title, summary, tasks };
}

// ─── In-Memory Store ──────────────────────────────────────────────────────

class Store {
  plans = new Map<string, Plan>();
  criteria = new Map<string, AcceptanceCriterion>();
  techSpecs = new Map<string, TechSpec>();

  // ─── Plan Methods ──────────────────────────────────────────────────────

  createPlan(prd: string): Plan {
    const { title, summary, tasks } = generateTasksFromPRD(prd);

    const plan: Plan = {
      id: crypto.randomUUID(),
      prd,
      title,
      summary,
      tasks,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.plans.set(plan.id, plan);

    // Index criteria for quick lookup
    for (const task of tasks) {
      for (const criterion of task.acceptanceCriteria) {
        this.criteria.set(criterion.id, criterion);
      }
    }

    return plan;
  }

  getPlan(id: string): Plan | undefined {
    return this.plans.get(id);
  }

  listPlans(): Plan[] {
    return Array.from(this.plans.values());
  }

  // ─── Apply Methods ────────────────────────────────────────────────────

  applyPlan(id: string): Plan | undefined {
    const plan = this.plans.get(id);
    if (!plan) return undefined;

    // Mark all pending tasks as in-progress
    for (const task of plan.tasks) {
      if (task.status === 'pending') {
        task.status = 'in_progress';
      }
    }
    plan.status = 'in_progress';
    plan.updatedAt = new Date().toISOString();

    return plan;
  }

  // ─── Unify Methods ───────────────────────────────────────────────────

  unifyPlan(id: string): TechSpec | undefined {
    const plan = this.plans.get(id);
    if (!plan) return undefined;

    const totalCriteria = plan.tasks.reduce((acc, t) => acc + t.acceptanceCriteria.length, 0);
    const passedCriteria = plan.tasks.reduce(
      (acc, t) => acc + t.acceptanceCriteria.filter((c) => c.status === 'passed').length,
      0,
    );
    const completedTasks = plan.tasks.filter((t) => t.status === 'done').length;

    const sections: TechSpecSection[] = [
      {
        title: 'Overview',
        content: `Technical specification for: ${plan.title}\n\n${plan.summary}\n\nPlan Status: ${plan.status}\nTasks: ${plan.tasks.length} total, ${completedTasks} completed\nAcceptance Criteria: ${totalCriteria} total, ${passedCriteria} passed`,
      },
      {
        title: 'Architecture',
        content: `The system follows a modular service-oriented architecture.\n\nKey components:\n${plan.tasks.map((t) => `- ${t.title}: ${t.description}`).join('\n')}\n\nCommunication between components uses well-defined API contracts with Zod schema validation.`,
      },
      {
        title: 'API Design',
        content: `RESTful API endpoints following /api/v1/ convention.\n\nEndpoints are organized by resource domain:\n${plan.tasks
          .filter((t) => t.title.toLowerCase().includes('api') || t.title.toLowerCase().includes('endpoint'))
          .map((t) => `  - ${t.title}: ${t.description}`)
          .join('\n') || '  - Standard CRUD endpoints for each resource\n  - Health check at /health'}\n\nAll endpoints use Fastify with Zod validation middleware.`,
      },
      {
        title: 'Data Model',
        content: `Core entities:\n${plan.tasks
          .filter((t) => t.title.toLowerCase().includes('model') || t.title.toLowerCase().includes('data'))
          .map((t) => `  - ${t.title}: ${t.description}`)
          .join('\n') || '  - Entities derived from PRD requirements\n  - All entities include id, createdAt, updatedAt fields'}\n\nData is stored in-memory during development with migration path to PostgreSQL via Drizzle ORM.`,
      },
      {
        title: 'Testing Strategy',
        content: `Testing pyramid:\n1. Unit Tests: Vitest for individual store methods and utility functions\n2. Integration Tests: Fastify inject() for API endpoint testing\n3. E2E Tests: Full service lifecycle testing\n\nCurrent status:\n- Acceptance Criteria: ${passedCriteria}/${totalCriteria} passed\n- Tasks Completed: ${completedTasks}/${plan.tasks.length}\n\nAll tests run via \`vitest run\` and are included in CI pipeline.`,
      },
    ];

    const techSpec: TechSpec = {
      planId: id,
      generatedAt: new Date().toISOString(),
      sections,
    };

    this.techSpecs.set(id, techSpec);
    return techSpec;
  }

  // ─── Criteria Methods ─────────────────────────────────────────────────

  getCriteria(planId: string): AcceptanceCriterion[] {
    const plan = this.plans.get(planId);
    if (!plan) return [];

    return plan.tasks.flatMap((t) => t.acceptanceCriteria);
  }

  updateCriteriaStatus(planId: string, criteriaId: string, status: AcceptanceCriterion['status']): AcceptanceCriterion | undefined {
    const plan = this.plans.get(planId);
    if (!plan) return undefined;

    for (const task of plan.tasks) {
      const criterion = task.acceptanceCriteria.find((c) => c.id === criteriaId);
      if (criterion) {
        criterion.status = status;
        plan.updatedAt = new Date().toISOString();

        // Check if all criteria in a task are passed -> mark task done
        if (task.acceptanceCriteria.every((c) => c.status === 'passed')) {
          task.status = 'done';
        }

        // Check if all tasks are done -> mark plan completed
        if (plan.tasks.every((t) => t.status === 'done')) {
          plan.status = 'completed';
        }

        return criterion;
      }
    }

    return undefined;
  }
}

export const store = new Store();
