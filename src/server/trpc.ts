/**
 * ========================================
 *  tRPC Server Initialization
 * ========================================
 *
 *  MAPPING TO RPC THEORY:
 *  ──────────────────────
 *  This file = "Server Stub" + "RPC Runtime" (server-side)
 *
 *  What it does:
 *  1. Initializes the tRPC engine
 *  2. Configures SuperJSON for marshalling/unmarshalling
 *     (SuperJSON serializes Date, Map, Set, BigInt — not just plain JSON)
 *  3. Exports "building blocks" for defining procedures (query/mutation)
 *
 *  In classic RPC, you need:
 *  - An IDL file (.proto / .thrift) → tRPC does NOT need one! TypeScript = IDL
 *  - A stub generator → tRPC generates automatically from TypeScript types
 *  - Manual marshalling → SuperJSON handles this transparently
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

/**
 * Context — information available in every RPC procedure.
 * You can add here: user session, database connection, etc.
 *
 * Think of Context as "metadata" sent with every RPC call.
 */
export type Context = {
  requestId: string; // For tracing/debugging
  timestamp: Date;
};

export function createContext(): Context {
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date(),
  };
}

/**
 * tRPC Initialization
 *
 * transformer: superjson → automatic MARSHALLING
 * SuperJSON converts complex TypeScript types to JSON and back.
 * This is the equivalent of "Protocol Buffers" from gRPC, but without .proto files!
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

/**
 * Exports — building blocks for defining procedures
 *
 * router  → groups procedures (like a "service" in gRPC)
 * publicProcedure → a procedure accessible to everyone
 * middleware → logic executed BEFORE the handler (logging, auth, etc.)
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * MIDDLEWARE: Logging
 *
 * Equivalent in classic RPC: "interceptor" — code that runs
 * on every request, before and after procedure execution.
 *
 * Useful for:
 * - Debugging (see which procedures are called)
 * - Monitoring (how long each call takes)
 * - Idempotency checking (from "Critical Design Considerations" section)
 */
const loggingMiddleware = middleware(async ({ path, type, next }) => {
  const start = Date.now();

  // Execute procedure
  const result = await next();

  const duration = Date.now() - start;
  const status = result.ok ? "✅ OK" : "❌ ERROR";

  console.log(`[RPC] ${type.toUpperCase()} ${path} → ${status} (${duration}ms)`);

  return result;
});

/**
 * Logged procedure — all procedures will be monitored automatically
 */
export const loggedProcedure = publicProcedure.use(loggingMiddleware);
