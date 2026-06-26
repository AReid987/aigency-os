import type { BuildJob, JobStatus, Skill } from './schemas.js';

// ─── In-Memory Store ──────────────────────────────────────────────────────

class Store {
  jobs = new Map<string, BuildJob>();
  skills = new Map<string, Skill>();

  // ─── Job Methods ─────────────────────────────────────────────────────

  createJob(data: {
    type: BuildJob['type'];
    spec: string;
    skills?: string[];
  }): BuildJob {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const job: BuildJob = {
      id,
      type: data.type,
      spec: data.spec,
      status: 'pending',
      skills: data.skills ?? [],
      output: null,
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(id, job);
    return job;
  }

  getJob(id: string): BuildJob | undefined {
    return this.jobs.get(id);
  }

  listJobs(): BuildJob[] {
    return Array.from(this.jobs.values());
  }

  updateJobStatus(
    id: string,
    status: JobStatus,
    output?: string
  ): BuildJob | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    job.status = status;
    job.updatedAt = new Date().toISOString();
    if (output !== undefined) {
      job.output = output;
    }
    return job;
  }

  // ─── Skill Methods ───────────────────────────────────────────────────

  createSkill(data: {
    name: string;
    description: string;
    version: string;
  }): Skill {
    const id = crypto.randomUUID();
    const skill: Skill = {
      id,
      name: data.name,
      description: data.description,
      version: data.version,
      createdAt: new Date().toISOString(),
    };
    this.skills.set(id, skill);
    return skill;
  }

  getSkill(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  listSkills(): Skill[] {
    return Array.from(this.skills.values());
  }
}

export const store = new Store();
