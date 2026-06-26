# ADR-002: HCOM Protocol for Agent Communication

- **Status:** Accepted
- **Date:** 2026-04-22
- **Deciders:** Technical Founders
- **Tags:** agents, communication, protocol

---

## Context

Aigency OS orchestrates multiple AI agents (BMAD, PAUL, Gstack, AEGIS, etc.) that must communicate with each other and with the orchestration layer. We need a communication protocol that supports:

1. **Agent lifecycle management** — spawn, monitor, shutdown agents
2. **Task delegation** — send tasks to specific agents or broadcast
3. **Status reporting** — agents report progress, completion, errors
4. **Message routing** — route messages between agents by ID, type, or topic
5. **Budget enforcement** — track and limit agent resource consumption
6. **Auditability** — log all agent communications for AEGIS review

### Alternatives Considered

| Approach | Description |
|----------|-------------|
| **HCOM (custom)** | Lightweight HTTP/WebSocket message bus with agent registry |
| **RabbitMQ** | Enterprise message broker with AMQP protocol |
| **Apache Kafka** | Distributed event streaming platform |
| **Redis Pub/Sub** | In-process pub/sub via Redis channels |
| **Direct HTTP** | Agent-to-agent HTTP calls with a service registry |
| **LangChain agents** | Framework-managed agent orchestration |

---

## Decision

We built **HCOM** (Hermes Communication Protocol) as a custom lightweight message bus.

---

## Rationale

### 1. Purpose-Built for Agent Orchestration
HCOM is designed specifically for the AI agent lifecycle pattern: spawn → assign task → monitor → collect result → shutdown. Generic message brokers require significant configuration to model this pattern.

### 2. Dual Transport (HTTP + WebSocket)
HCOM exposes both REST endpoints (for synchronous operations like spawning) and WebSocket channels (for real-time message streaming). This gives us:
- REST for control plane operations (spawn, list, budget queries)
- WebSocket for data plane operations (task messages, status updates)

### 3. Zero Infrastructure Dependencies
HCOM runs as a single Fastify process. No external message broker to deploy, configure, or maintain. For v0.1.0 with 9 services, this eliminates operational complexity.

### 4. Integrated Budget Enforcement
HCOM tracks token and cost budgets per agent at the protocol level. Messages are rejected if an agent exceeds its budget — enforcement happens at the communication layer, not in each agent.

### 5. Built-in Audit Trail
Every message through HCOM is logged with sender, receiver, timestamp, type, and payload size. AEGIS consumes these logs for quality audits. A generic broker would require a separate logging pipeline.

### 6. Simple Agent API
Agents interact with HCOM via a minimal API:

```
POST /api/agents          — spawn
GET  /api/agents          — list
POST /api/messages        — send
GET  /api/messages/:id    — receive
WS   /                    — real-time stream
```

No client libraries, no protocol-specific SDKs. Any HTTP client can participate.

### Trade-offs

| Trade-off | Impact | Mitigation |
|-----------|--------|------------|
| Not horizontally scalable | Single-process message bus | Acceptable for v0.1.0; add Redis Streams for v0.2.0 |
| No message persistence | Messages lost on restart | Add PostgreSQL-backed message store in v0.2.0 |
| No delivery guarantees | At-most-once delivery | Agents implement idempotent task handling |
| No built-in retry | Failed tasks stay failed | Add retry logic in orchestrator for v0.2.0 |
| Custom protocol | Must maintain ourselves | Thin implementation (~500 LOC); well-documented |

---

## Consequences

### Positive
- Agent communication is visible in the HCOM Dashboard in real-time
- Budget enforcement happens automatically at the transport layer
- AEGIS can audit all agent interactions from HCOM logs
- New agents can be added by implementing a simple HTTP interface
- No infrastructure costs beyond the existing Node.js runtime

### Negative
- Not suitable for high-throughput scenarios (>1000 msg/sec)
- Single point of failure if HCOM service crashes
- Must implement our own retry, dead-letter, and scaling logic as needs grow

### Risks
- If agent count grows beyond ~50 concurrent agents, HCOM may become a bottleneck. Mitigated by planned Redis Streams migration in v0.2.0.

---

## Message Format

```typescript
interface HcomMessage {
  id: string;              // UUID
  from: string;            // sender agent ID
  to: string;              // receiver agent ID or "broadcast"
  type: 'task' | 'result' | 'status' | 'error' | 'heartbeat';
  payload: unknown;        // message-specific data
  timestamp: string;       // ISO 8601
  metadata: {
    ventureId?: string;    // associated venture
    tokenCost?: number;    // estimated token cost
    priority?: 'low' | 'normal' | 'high';
  };
}
```

---

## References

- [HCOM API Source](../../services/hcom-api/src/index.ts)
- [HCOM Dashboard](../../apps/hcom-dashboard/)
- [ADR-003: In-Memory Stores](./ADR-003-in-memory-stores.md)
