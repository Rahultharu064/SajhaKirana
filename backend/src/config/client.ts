import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";

const adapter = new PrismaPlanetScale({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const prismaClient = prisma;
