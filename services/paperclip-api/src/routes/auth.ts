import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'node:crypto';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Config ─────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'aigency-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

// ─── SQLite Database ────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.AUTH_DB_PATH || path.join(__dirname, '..', '..', 'data', 'auth.db');

// Ensure data directory exists
import fs from 'node:fs';
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'domain_expert',
    company TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
`);

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

// ─── DB Helpers ─────────────────────────────────────────────────────────────

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technical_founder' | 'domain_expert';
  company?: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

function findUserByEmail(email: string): StoredUser | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as StoredUser | undefined;
}

function findUserById(id: string): StoredUser | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as StoredUser | undefined;
}

function createUser(data: { email: string; name: string; role: string; company?: string; passwordHash: string }): StoredUser {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO users (id, email, name, role, company, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, data.email.toLowerCase(), data.name, data.role, data.company || null, data.passwordHash, now, now);
  return findUserById(id)!;
}

// ─── Seed Admin Account ─────────────────────────────────────────────────────

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aigency.os';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Antonio Reid';

if (!findUserByEmail(ADMIN_EMAIL)) {
  createUser({
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    role: 'admin',
    company: 'Aigency',
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, SALT_ROUNDS),
  });
  console.log(`[Auth] Seeded admin account: ${ADMIN_EMAIL}`);
}

// ─── JWT Helpers ────────────────────────────────────────────────────────────

function signToken(user: StoredUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
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

export async function authMiddleware(request: any, reply: any) {
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
}

// ─── Routes ─────────────────────────────────────────────────────────────────

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/register — creates domain_expert accounts
  app.post('/auth/register', async (request, reply) => {
    const parsed = RegisterSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const { email, password, name, company } = parsed.data;

    const existing = findUserByEmail(email);
    if (existing) {
      return reply.code(409).send({ error: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
    const user = createUser({
      email,
      name,
      role: 'domain_expert',
      company,
      passwordHash,
    });

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
    const user = findUserByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }

    const token = signToken(user);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, company: user.company },
      token,
    };
  });

  // GET /auth/me
  app.get('/auth/me', { preHandler: authMiddleware }, async (request, reply) => {
    const payload = (request as any).user;
    const user = findUserById(payload.sub);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
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

    return db.prepare('SELECT id, email, name, role, company, created_at FROM users ORDER BY created_at DESC').all();
  });
}

export { signToken, verifyToken };
