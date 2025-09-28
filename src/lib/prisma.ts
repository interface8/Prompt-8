import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws"; // Import synchronously
import { PrismaClient } from "@prisma/client";
import { env, isDevelopment } from "./env";

// Configure WebSocket for Neon - MUST happen before any connection attempts
neonConfig.webSocketConstructor = ws;

// Prevent multiple instances in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Initialize Prisma Client with Neon adapter
function createPrismaClient() {
  // Create adapter with proper configuration
  const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });

  // Create new PrismaClient with the adapter
  return new PrismaClient({ adapter });
}

// Use existing Prisma instance if available, otherwise create a new one
const prisma = globalForPrisma.prisma || createPrismaClient();

// Save reference to prisma client on the global object in development
if (isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
