import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

import { PrismaClient } from '../prisma/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';


const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});

console.log(process.env.DATABASE_URL);
export const prismaClient = new PrismaClient({ adapter });

