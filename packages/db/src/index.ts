import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if(!connectionString){
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });

export { prismaClient }; 