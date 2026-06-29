import type { FastifyInstance } from 'fastify';
export declare function agentRoutes(app: FastifyInstance): Promise<void>;
export declare function getAgentById(id: string): Record<string, unknown> | undefined;
export declare function insertAgentRow(params: {
    id: string;
    name: string;
    adapter: string;
    terminal_type: string;
    status: string;
    parent_id: string | null;
    session_id: string;
}): void;
export declare function removeAgent(id: string): void;
type EventCallback = (eventType: string, targetId: string, payload: unknown) => void;
export declare function onEvent(cb: EventCallback): void;
export declare function notifySubscribers(eventType: string, targetId: string, payload: unknown): void;
export {};
//# sourceMappingURL=agents.d.ts.map