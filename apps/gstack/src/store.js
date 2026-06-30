// ─── In-Memory Store ──────────────────────────────────────────────────────
class Store {
    jobs = new Map();
    skills = new Map();
    // ─── Job Methods ─────────────────────────────────────────────────────
    createJob(data) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const job = {
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
    getJob(id) {
        return this.jobs.get(id);
    }
    listJobs() {
        return Array.from(this.jobs.values());
    }
    updateJobStatus(id, status, output) {
        const job = this.jobs.get(id);
        if (!job)
            return undefined;
        job.status = status;
        job.updatedAt = new Date().toISOString();
        if (output !== undefined) {
            job.output = output;
        }
        return job;
    }
    // ─── Skill Methods ───────────────────────────────────────────────────
    createSkill(data) {
        const id = crypto.randomUUID();
        const skill = {
            id,
            name: data.name,
            description: data.description,
            version: data.version,
            createdAt: new Date().toISOString(),
        };
        this.skills.set(id, skill);
        return skill;
    }
    getSkill(id) {
        return this.skills.get(id);
    }
    listSkills() {
        return Array.from(this.skills.values());
    }
}
export const store = new Store();
//# sourceMappingURL=store.js.map