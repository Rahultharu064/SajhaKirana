import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client without adapter to avoid connection pool issues
const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

export const prismaClient = prisma;
