import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DB_PATH = process.env.HCOM_DB_PATH ?? './data/hcom.db';

// Ensure parent directory exists
mkdirSync(dirname(DB_PATH), { recursive: true });

const db: DatabaseType = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ─────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    adapter       TEXT NOT NULL,
    terminal_type TEXT NOT NULL DEFAULT 'tmux',
    status        TEXT NOT NULL DEFAULT 'active',
    active_task   TEXT,
    parent_id     TEXT,
    last_heartbeat TEXT NOT NULL DEFAULT (datetime('now')),
    session_id    TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES agents(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id              TEXT PRIMARY KEY,
    sender_id       TEXT NOT NULL,
    recipient_id    TEXT,            -- null = broadcast
    intent          TEXT NOT NULL DEFAULT 'message',
    content         TEXT NOT NULL,
    context_bundle  TEXT NOT NULL DEFAULT '{}',
    delivery_status TEXT NOT NULL DEFAULT 'pending',
    read_at         TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (sender_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES agents(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS file_edits (
    id          TEXT PRIMARY KEY,
    agent_id    TEXT NOT NULL,
    file_path   TEXT NOT NULL,
    operation   TEXT NOT NULL DEFAULT 'edit',
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS collisions (
    id          TEXT PRIMARY KEY,
    file_path   TEXT NOT NULL,
    agent1_id   TEXT NOT NULL,
    agent2_id   TEXT NOT NULL,
    edit1_id    TEXT NOT NULL,
    edit2_id    TEXT NOT NULL,
    resolved    INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (agent1_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (agent2_id) REFERENCES agents(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id          TEXT PRIMARY KEY,
    agent_id    TEXT NOT NULL,
    event_type  TEXT NOT NULL,
    target_id   TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
  CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_messages_delivery ON messages(delivery_status);
  CREATE INDEX IF NOT EXISTS idx_file_edits_path ON file_edits(file_path);
  CREATE INDEX IF NOT EXISTS idx_file_edits_agent ON file_edits(agent_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_agent ON subscriptions(agent_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_event ON subscriptions(event_type);
`);

export default db;
