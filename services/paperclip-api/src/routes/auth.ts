import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'node:crypto';

// ─── Config ─────────────────────────────────────────────────────────────────

const JWT_SECRET = 'aigency-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

// ─── Schemas ────────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  company: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// ─── In-Memory User Store ───────────────────────────────────────────────────

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technical_founder' | 'domain_expert';
  company?: string;
  passwordHash: string;
  createdAt: string;
}

const users = new Map<string, StoredUser>();

// Seed admin account
const adminId = crypto.randomUUID();
users.set(adminId, {
  id: adminId,
  email: 'admin@aigency.os',
  name: 'Antonio Reid',
  role: 'admin',
  company: 'Aigency',
  passwordHash: bcrypt.hashSync('admin123', SALT_ROUNDS),
  createdAt: new Date().toISOString(),
});

// ─── JWT Helpers ────────────────────────────────────────────────────────────

function signToken(user: StoredUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token: string): { sub: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string };
  } catch {
    return null;
  }
}

// ─── Auth Middleware ────────────────────────────────────────────────────────

export function authMiddleware(request: any, reply: any, done: any) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }

  request.user = payload;
  done();
}

// ─── Routes ─────────────────────────────────────────────────────────────────

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/register
  app.post('/auth/register', async (request, reply) => {
    const parsed = RegisterSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const { email, password, name, company } = parsed.data;

    const existing = Array.from(users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return reply.code(409).send({ error: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
    const user: StoredUser = {
      id: crypto.randomUUID(),
      email,
      name,
      role: 'domain_expert',
      company,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.set(user.id, user);
    const token = signToken(user);

    return reply.code(201).send({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, company: user.company },
      token,
    });
  });

  // POST /auth/login
  app.post('/auth/login', async (request, reply) => {
    const parsed = LoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const { email, password } = parsed.data;

    const user = Array.from(users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }

    const token = signToken(user);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, company: user.company },
      token,
    };
  });

  // GET /auth/me
  app.get('/auth/me', { preHandler: authMiddleware }, async (request) => {
    const payload = (request as any).user;
    const user = users.get(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
    };
  });

  // GET /auth/users — admin only
  app.get('/auth/users', { preHandler: authMiddleware }, async (request, reply) => {
    const payload = (request as any).user;
    if (payload.role !== 'admin') {
      return reply.code(403).send({ error: 'Admin access required' });
    }

    return Array.from(users.values()).map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      company: u.company,
      createdAt: u.createdAt,
    }));
  });
}

export { users, signToken, verifyToken };
