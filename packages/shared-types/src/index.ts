// ─── Canvas Types ────────────────────────────────────────────────────────────

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type CardType = 'text' | 'image' | 'link' | 'embed' | 'calculator' | 'preview' | 'bmc' | 'revenue' | 'gate' | 'spec';
export type ZoneType = 'business' | 'engineering' | 'shared';

export interface Card {
  id: string;
  zoneId: string;
  type: CardType;
  content: Record<string, unknown>;
  position: Position;
  size: Size;
  createdBy: string;
  lastModified: string;
  versionHistory: Version[];
}

export interface Version {
  id: string;
  timestamp: string;
  changes: Record<string, unknown>;
  author: string;
}

export interface Zone {
  id: string;
  type: ZoneType;
  name: string;
  cards: Card[];
  collaborators: string[];
  permissions: Permission[];
}

export interface Permission {
  userId: string;
  level: 'read' | 'write' | 'admin';
}

// ─── Agent Types ─────────────────────────────────────────────────────────────

export type AgentRole = 'CEO' | 'CTO' | 'CMO' | 'Sales' | 'Engineer' | 'QA' | 'Designer';
export type AgentStatus = 'active' | 'paused' | 'terminated' | 'thinking' | 'blocked';
export type AgentAdapter = 'claude' | 'codex' | 'gemini' | 'cursor' | 'hermes' | 'kimi' | 'omp' | 'mimo' | 'opencode' | 'command' | 'blackbox' | 'groq' | 'mistral';
export type HeartbeatSchedule = '4h' | '8h' | '12h' | 'continuous';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  reportingTo: string | null;
  budgetLimit: number;
  budgetSpent: number;
  heartbeatSchedule: HeartbeatSchedule;
  status: AgentStatus;
  skills: string[];
  adapter: AgentAdapter;
}

// ─── Company Types ───────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  mission: string;
  goals: Goal[];
  agents: Agent[];
  projects: Project[];
  budgets: Budget;
  auditLog: AuditEntry[];
}

export interface Goal {
  id: string;
  companyId: string;
  parentGoalId: string | null;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'done' | 'blocked';
  priority: 'P0' | 'P1' | 'P2';
  tasks: Task[];
}

export interface Task {
  id: string;
  goalId: string;
  assigneeId: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: 'backlog' | 'in_progress' | 'review' | 'done' | 'rejected';
  contextChain: string[];
  toolCalls: ToolCall[];
  auditTrail: AuditEntry[];
}

export interface ToolCall {
  id: string;
  tool: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  timestamp: string;
  duration: number;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface Budget {
  total: number;
  spent: number;
  perAgent: Record<string, { limit: number; spent: number }>;
}

// ─── Ticket Types ────────────────────────────────────────────────────────────

export interface Ticket {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done' | 'rejected';
  priority: 'P0' | 'P1' | 'P2';
  comments: TicketComment[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}

// ─── HCOM Types ──────────────────────────────────────────────────────────────

export interface HCOMMessage {
  id: string;
  senderId: string;
  recipientId: string | null; // null = broadcast
  intent: string;
  content: string;
  contextBundle: Record<string, unknown>;
  timestamp: string;
  deliveryStatus: 'pending' | 'delivered' | 'read';
}

export interface HCOMAgent {
  id: string;
  name: string;
  adapter: AgentAdapter;
  status: AgentStatus;
  activeTask: string | null;
  lastHeartbeat: string;
  sessionId: string;
}

export interface Collision {
  id: string;
  filePath: string;
  agent1: string;
  agent2: string;
  timestamp: string;
  resolved: boolean;
}

// ─── Brain Types ─────────────────────────────────────────────────────────────

export type KnowledgeSource = 'paperclip' | 'hcom' | 'aegis' | 'plannotator' | 'bmad' | 'manual';
export type KnowledgeType = 'decision' | 'plan' | 'audit' | 'assumption' | 'fact';

export interface KnowledgePage {
  id: string;
  source: KnowledgeSource;
  type: KnowledgeType;
  title: string;
  content: string;
  frontmatter: Record<string, unknown>;
  confidence: number;
  recency: string;
  evidenceSources: string[];
  supersedes: string[];
  contradictions: string[];
}

// ─── User Types ──────────────────────────────────────────────────────────────

export type UserRole = 'domain_expert' | 'technical_founder' | 'agent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

// ─── Sprint 2 Re-exports ────────────────────────────────────────────────────

export * from './bmad';
export * from './paul';
export * from './carl';
export * from './gstack';
