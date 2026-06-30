import type { BuildJob, JobStatus, Skill } from './schemas.js';
declare class Store {
    jobs: Map<string, BuildJob>;
    skills: Map<string, Skill>;
    createJob(data: {
        type: BuildJob['type'];
        spec: string;
        skills?: string[];
    }): BuildJob;
    getJob(id: string): BuildJob | undefined;
    listJobs(): BuildJob[];
    updateJobStatus(id: string, status: JobStatus, output?: string): BuildJob | undefined;
    createSkill(data: {
        name: string;
        description: string;
        version: string;
    }): Skill;
    getSkill(id: string): Skill | undefined;
    listSkills(): Skill[];
}
export declare const store: Store;
export {};
//# sourceMappingURL=store.d.ts.map