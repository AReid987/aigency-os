import type { PlanSection } from './schemas.js';

// ─── Plan Types ───────────────────────────────────────────────────────────

export interface Plan {
  id: string;
  title: string;
  description: string;
  source: 'paperclip' | 'manual' | 'plannotator';
  sections: PlanSection[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Annotation {
  id: string;
  planId: string;
  author: string;
  role: 'domain_expert' | 'technical_founder' | 'agent';
  sectionId?: string;
  content: string;
  type: 'comment' | 'suggestion' | 'concern' | 'approval';
  createdAt: string;
}

export interface PlanVersion {
  version: number;
  planId: string;
  snapshot: Omit<Plan, 'id'>;
  timestamp: string;
}

export interface DiffResult {
  planId: string;
  v1: number;
  v2: number;
  changes: {
    field: string;
    from: unknown;
    to: unknown;
  }[];
}

// ─── In-Memory Store ──────────────────────────────────────────────────────

class PlannotatorStore {
  plans = new Map<string, Plan>();
  annotations = new Map<string, Annotation[]>(); // planId -> annotations
  versions = new Map<string, PlanVersion[]>();    // planId -> versions

  // ─── Plan Methods ───────────────────────────────────────────────────────

  createPlan(data: {
    title: string;
    description?: string;
    source?: 'paperclip' | 'manual' | 'plannotator';
    sections?: PlanSection[];
  }): Plan {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const plan: Plan = {
      id,
      title: data.title,
      description: data.description ?? '',
      source: data.source ?? 'manual',
      sections: data.sections ?? [],
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(id, plan);
    this.annotations.set(id, []);
    this.versions.set(id, [
      {
        version: 1,
        planId: id,
        snapshot: {
          title: plan.title,
          description: plan.description,
          source: plan.source,
          sections: plan.sections,
          version: plan.version,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        },
        timestamp: now,
      },
    ]);

    return plan;
  }

  getPlan(id: string, role?: string): Plan | undefined {
    const plan = this.plans.get(id);
    if (!plan) return undefined;

    if (!role) return plan;

    // RBAC: filter sections based on role
    const filteredSections = plan.sections.filter((section) => {
      return section.accessRoles.includes(role as 'domain_expert' | 'technical_founder' | 'agent');
    });

    return { ...plan, sections: filteredSections };
  }

  listPlans(filter?: { source?: string }): Plan[] {
    let plans = Array.from(this.plans.values());
    if (filter?.source) {
      plans = plans.filter((p) => p.source === filter.source);
    }
    return plans;
  }

  updatePlan(id: string, data: { title?: string; description?: string; sections?: PlanSection[] }): Plan | undefined {
    const plan = this.plans.get(id);
    if (!plan) return undefined;

    if (data.title !== undefined) plan.title = data.title;
    if (data.description !== undefined) plan.description = data.description;
    if (data.sections !== undefined) plan.sections = data.sections;
    plan.version += 1;
    plan.updatedAt = new Date().toISOString();

    // Save version snapshot
    const versions = this.versions.get(id) ?? [];
    versions.push({
      version: plan.version,
      planId: id,
      snapshot: {
        title: plan.title,
        description: plan.description,
        source: plan.source,
        sections: plan.sections,
        version: plan.version,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      },
      timestamp: plan.updatedAt,
    });
    this.versions.set(id, versions);

    return plan;
  }

  // ─── Annotation Methods ─────────────────────────────────────────────────

  addAnnotation(planId: string, data: {
    author: string;
    role: 'domain_expert' | 'technical_founder' | 'agent';
    sectionId?: string;
    content: string;
    type?: 'comment' | 'suggestion' | 'concern' | 'approval';
  }): Annotation | undefined {
    const plan = this.plans.get(planId);
    if (!plan) return undefined;

    const annotation: Annotation = {
      id: crypto.randomUUID(),
      planId,
      author: data.author,
      role: data.role,
      sectionId: data.sectionId,
      content: data.content,
      type: data.type ?? 'comment',
      createdAt: new Date().toISOString(),
    };

    const annotations = this.annotations.get(planId) ?? [];
    annotations.push(annotation);
    this.annotations.set(planId, annotations);

    return annotation;
  }

  getAnnotations(planId: string): Annotation[] {
    return this.annotations.get(planId) ?? [];
  }

  // ─── Diff Methods ───────────────────────────────────────────────────────

  getDiff(planId: string, v1: number, v2: number): DiffResult | undefined {
    const versions = this.versions.get(planId);
    if (!versions) return undefined;

    const version1 = versions.find((v) => v.version === v1);
    const version2 = versions.find((v) => v.version === v2);
    if (!version1 || !version2) return undefined;

    const changes: DiffResult['changes'] = [];
    const snap1 = version1.snapshot;
    const snap2 = version2.snapshot;

    if (snap1.title !== snap2.title) {
      changes.push({ field: 'title', from: snap1.title, to: snap2.title });
    }
    if (snap1.description !== snap2.description) {
      changes.push({ field: 'description', from: snap1.description, to: snap2.description });
    }
    if (JSON.stringify(snap1.sections) !== JSON.stringify(snap2.sections)) {
      changes.push({ field: 'sections', from: snap1.sections, to: snap2.sections });
    }

    return { planId, v1, v2, changes };
  }

  // ─── Seed Data ──────────────────────────────────────────────────────────

  seed(): void {
    this.createPlan({
      title: 'AIGENCY OS Platform Launch',
      description: 'Strategic plan for launching the AIGENCY OS multi-agent orchestration platform.',
      source: 'paperclip',
      sections: [
        {
          id: crypto.randomUUID(),
          type: 'business',
          title: 'Market Opportunity',
          content: 'The multi-agent orchestration market is projected to reach $5B by 2028. Key segments include enterprise automation, AI-assisted development, and autonomous business operations.',
          accessRoles: ['domain_expert', 'technical_founder', 'agent'],
        },
        {
          id: crypto.randomUUID(),
          type: 'business',
          title: 'Revenue Model',
          content: 'SaaS tiered pricing: Starter ($49/mo), Pro ($199/mo), Enterprise (custom). Additional revenue from marketplace commissions and premium agent adapters.',
          accessRoles: ['domain_expert', 'technical_founder', 'agent'],
        },
        {
          id: crypto.randomUUID(),
          type: 'technical',
          title: 'Architecture Overview',
          content: 'Microservices architecture with Fastify-based API services, event-driven communication via HCOM, shared types monorepo pattern with pnpm workspaces and Turborepo.',
          accessRoles: ['technical_founder'],
        },
        {
          id: crypto.randomUUID(),
          type: 'technical',
          title: 'Tech Stack',
          content: 'TypeScript, Fastify 5, React, PostgreSQL, Drizzle ORM, Vitest, pnpm workspaces, Turborepo, Docker.',
          accessRoles: ['technical_founder'],
        },
        {
          id: crypto.randomUUID(),
          type: 'architecture',
          title: 'Service Topology',
          content: 'Core services: paperclip-api (CRM/ops), plannotator (plan review), hcom (communication), aegis (security), brain (knowledge). Frontend: aigency-app (React).',
          accessRoles: ['technical_founder'],
        },
      ],
    });

    this.createPlan({
      title: 'Q3 Agent Hiring Strategy',
      description: 'Plan for scaling the agent workforce in Q3, focusing on engineering and sales roles.',
      source: 'manual',
      sections: [
        {
          id: crypto.randomUUID(),
          type: 'business',
          title: 'Hiring Goals',
          content: 'Hire 5 new Engineer agents and 2 Sales agents by end of Q3. Budget allocation: $50K total, with 70% for engineering and 30% for sales.',
          accessRoles: ['domain_expert', 'technical_founder', 'agent'],
        },
        {
          id: crypto.randomUUID(),
          type: 'business',
          title: 'Agent Evaluation Criteria',
          content: 'Agents will be evaluated on: task completion rate >90%, budget efficiency <80% utilization, heartbeat compliance, and peer review scores.',
          accessRoles: ['domain_expert', 'technical_founder', 'agent'],
        },
        {
          id: crypto.randomUUID(),
          type: 'technical',
          title: 'Adapter Integration Plan',
          content: 'Priority adapters: Hermes (primary), Claude (complex reasoning), Codex (code generation). Each new agent must support at least 2 adapters for redundancy.',
          accessRoles: ['technical_founder'],
        },
        {
          id: crypto.randomUUID(),
          type: 'architecture',
          title: 'Scaling Considerations',
          content: 'Current bottleneck: single PostgreSQL instance. Plan: implement read replicas, add Redis caching layer, partition agent data by company.',
          accessRoles: ['technical_founder'],
        },
      ],
    });
  }
}

export const store = new PlannotatorStore();
