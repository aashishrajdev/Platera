import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Why this pattern?
 * 1. Next.js hot-reloads modules in development
 * 2. Each PrismaClient instance creates a connection pool
 * 3. Multiple instances = connection pool exhaustion
 * 4. Solution: Store in globalThis during development
 * 
 * In production: Fresh instance per deployment (no hot reload)
 * In development: Reuse same instance across hot reloads
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof window === 'undefined') {
    process.on('beforeExit', async () => {
        await prisma.$disconnect();
    });
}
