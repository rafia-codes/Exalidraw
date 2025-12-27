// packages/db/index.ts
import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient;

export function getPrismaClient() {
  if (!prismaClient) {
    console.log("DATABASE_URL inside packages/db:", process.env.DATABASE_URL); // for debugging
    prismaClient = new PrismaClient(); // no need for url/accelerateUrl
  }
  return prismaClient;
}
