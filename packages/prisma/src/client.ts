/**
 * Prisma client placeholder for Aigency OS.
 * In production, replace with generated PrismaClient after running:
 *   npx prisma generate
 *   npx prisma migrate deploy
 */

export interface PrismaConfig {
  databaseUrl?: string;
  log?: string[];
}

/**
 * Creates a Prisma client instance.
 * Currently returns a stub — replace with real PrismaClient after generation.
 */
export function createPrismaClient(config: PrismaConfig = {}) {
  const databaseUrl = config.databaseUrl ?? process.env.DATABASE_URL ?? 'postgresql://aigency:aigency_dev@localhost:5432/aigency';

  return {
    $connect: async () => { /* noop — stub */ },
    $disconnect: async () => { /* noop — stub */ },
    $queryRaw: async (query: unknown) => { throw new Error('Prisma not generated. Run: npx prisma generate'); },
    config: { databaseUrl },
  };
}

export type PrismaClient = ReturnType<typeof createPrismaClient>;

export default createPrismaClient;
