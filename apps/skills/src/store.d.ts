import type { SkillCategory, InstallSkillInput, RateSkillInput } from './schemas.js';
export interface Skill {
    id: string;
    name: string;
    description: string;
    category: SkillCategory;
    version: string;
    author: string;
    icon?: string;
    tags: string[];
    downloads: number;
    rating: number;
    ratingCount: number;
    configSchema?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface Installation {
    id: string;
    skillId: string;
    config?: Record<string, unknown>;
    environment: string;
    status: 'active' | 'inactive' | 'error';
    installedAt: string;
}
export interface Rating {
    id: string;
    skillId: string;
    rating: number;
    review?: string;
    createdAt: string;
}
export declare class SkillsStore {
    skills: Map<string, Skill>;
    installations: Map<string, Installation>;
    ratings: Map<string, Rating[]>;
    listSkills(category?: SkillCategory): Skill[];
    getSkill(id: string): Skill | undefined;
    installSkill(skillId: string, data: InstallSkillInput): Installation | undefined;
    validateSkill(id: string): {
        valid: boolean;
        issues: string[];
    };
    rateSkill(skillId: string, data: RateSkillInput): Rating | undefined;
    seed(): void;
}
export declare const store: SkillsStore;
//# sourceMappingURL=store.d.ts.map