import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateGoalSchema, UpdateGoalStatusSchema, CreateTaskSchema, UpdateTaskStatusSchema } from '../schemas.js';

export async function goalRoutes(app: FastifyInstance) {
  // POST /api/v1/companies/:companyId/goals — create goal
  app.post('/api/v1/companies/:companyId/goals', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const parsed = CreateGoalSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const goal = store.createGoal(companyId, parsed.data);
    if (!goal) {
      return reply.code(404).send({ error: 'Company or parent goal not found' });
    }

    return reply.code(201).send(goal);
  });

  // GET /api/v1/companies/:companyId/goals — list goals
  app.get('/api/v1/companies/:companyId/goals', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const company = store.getCompany(companyId);
    if (!company) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return { goals: store.listGoals(companyId) };
  });

  // GET /api/v1/companies/:companyId/goals/:goalId — get goal with ancestry
  app.get('/api/v1/companies/:companyId/goals/:goalId', async (request, reply) => {
    const { goalId } = request.params as { companyId: string; goalId: string };
    const goal = store.getGoal(goalId);
    if (!goal) {
      return reply.code(404).send({ error: 'Goal not found' });
    }
    const ancestry = store.getGoalAncestry(goalId);
    return { ...goal, ancestry };
  });

  // PATCH /api/v1/companies/:companyId/goals/:goalId/status — update goal status
  app.patch('/api/v1/companies/:companyId/goals/:goalId/status', async (request, reply) => {
    const { companyId, goalId } = request.params as { companyId: string; goalId: string };
    const parsed = UpdateGoalStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const goal = store.updateGoalStatus(goalId, parsed.data.status);
    if (!goal) {
      return reply.code(404).send({ error: 'Goal not found' });
    }

    store.addAuditEntry(companyId, {
      action: 'goal_status_changed',
      actor: 'system',
      details: { goalId, newStatus: parsed.data.status },
    });

    return goal;
  });

  // ─── Tasks (nested under goals) ──────────────────────────────────────

  // POST /api/v1/companies/:companyId/tasks — create task
  app.post('/api/v1/companies/:companyId/tasks', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const parsed = CreateTaskSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const task = store.createTask(companyId, parsed.data);
    if (!task) {
      return reply.code(404).send({ error: 'Company, goal, or agent not found' });
    }

    return reply.code(201).send(task);
  });

  // PATCH /api/v1/companies/:companyId/tasks/:taskId/status — update task status
  app.patch('/api/v1/companies/:companyId/tasks/:taskId/status', async (request, reply) => {
    const { companyId, taskId } = request.params as { companyId: string; taskId: string };
    const parsed = UpdateTaskStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const task = store.updateTaskStatus(taskId, parsed.data.status);
    if (!task) {
      return reply.code(404).send({ error: 'Task not found' });
    }

    store.addAuditEntry(companyId, {
      action: 'task_status_changed',
      actor: 'system',
      details: { taskId, newStatus: parsed.data.status },
    });

    return task;
  });
}
