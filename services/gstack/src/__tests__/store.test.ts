import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../store.js';

describe('Store', () => {
  beforeEach(() => {
    // Clear all maps between tests
    store.jobs.clear();
    store.skills.clear();
  });

  describe('Job methods', () => {
    it('should create a job', () => {
      const job = store.createJob({
        type: 'autoplan',
        spec: 'Build a landing page',
        skills: ['html', 'css'],
      });

      expect(job.id).toBeDefined();
      expect(job.type).toBe('autoplan');
      expect(job.spec).toBe('Build a landing page');
      expect(job.skills).toEqual(['html', 'css']);
      expect(job.status).toBe('pending');
      expect(job.output).toBeNull();
    });

    it('should get a job by id', () => {
      const created = store.createJob({ type: 'ship', spec: 'Deploy to prod' });
      const found = store.getJob(created.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
    });

    it('should return undefined for non-existent job', () => {
      expect(store.getJob('non-existent')).toBeUndefined();
    });

    it('should list all jobs', () => {
      store.createJob({ type: 'autoplan', spec: 'Job 1' });
      store.createJob({ type: 'qa', spec: 'Job 2' });
      store.createJob({ type: 'design', spec: 'Job 3' });

      const jobs = store.listJobs();
      expect(jobs).toHaveLength(3);
    });

    it('should update job status', () => {
      const job = store.createJob({ type: 'autoplan', spec: 'Test' });
      const updated = store.updateJobStatus(job.id, 'in_progress');

      expect(updated).toBeDefined();
      expect(updated!.status).toBe('in_progress');
    });

    it('should update job status with output', () => {
      const job = store.createJob({ type: 'qa', spec: 'Test' });
      const updated = store.updateJobStatus(job.id, 'done', 'All tests passed');

      expect(updated!.status).toBe('done');
      expect(updated!.output).toBe('All tests passed');
    });

    it('should return undefined when updating non-existent job', () => {
      expect(store.updateJobStatus('bad-id', 'done')).toBeUndefined();
    });
  });

  describe('Skill methods', () => {
    it('should create a skill', () => {
      const skill = store.createSkill({
        name: 'react-builder',
        description: 'Builds React apps',
        version: '1.0.0',
      });

      expect(skill.id).toBeDefined();
      expect(skill.name).toBe('react-builder');
      expect(skill.description).toBe('Builds React apps');
      expect(skill.version).toBe('1.0.0');
    });

    it('should get a skill by id', () => {
      const created = store.createSkill({ name: 'test', description: 'desc', version: '0.0.1' });
      const found = store.getSkill(created.id);

      expect(found).toBeDefined();
      expect(found!.name).toBe('test');
    });

    it('should list all skills', () => {
      store.createSkill({ name: 'a', description: 'A', version: '1.0.0' });
      store.createSkill({ name: 'b', description: 'B', version: '1.0.0' });

      expect(store.listSkills()).toHaveLength(2);
    });
  });
});
