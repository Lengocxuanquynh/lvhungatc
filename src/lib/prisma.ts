import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma_v2: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_IbjOcMP8Y0fL@ep-lucky-smoke-azgxsf4h-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma_v2 ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v2 = prisma;
