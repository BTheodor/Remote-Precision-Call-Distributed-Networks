/**
 * ========================================
 *  tRPC Client — "Client Stub" (auto-generat!)
 * ========================================
 *
 *  MAPPING TO RPC THEORY:
 *  ──────────────────────
 *  This file = "Client Stub" in the RPC architecture
 *
 *  "A proxy that pretends to be the remote function.
 *  It collects arguments and packages them (Marshalling)."
 *
 *  tRPC MAGIC: this stub is GENERATED AUTOMATICALLY from the AppRouter type.
 *  No manual serialization or deserialization needed!
 *
 *  When you write: trpc.math.remoteSum.useQuery({ a: 5, b: 10 })
 *  tRPC does:
 *  1. Checks TYPES at compile time (a: number, b: number)
 *  2. Serializes input → JSON (marshalling)
 *  3. Sends HTTP request → /api/trpc/math.remoteSum
 *  4. Receives response, deserializes → TypeScript object (unmarshalling)
 *  5. Returns result with the correct TYPE automatically!
 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

/**
 * `trpc` is our CLIENT STUB.
 *
 * Notice: we import only the AppRouter TYPE (not the server code!).
 * TypeScript types are "erased" at compile time — zero server code on the client.
 * But we get full autocomplete + type checking!
 *
 * This is the modern equivalent of "stub generation" from gRPC:
 * - gRPC: protoc compiles .proto → generates client stubs
 * - tRPC: TypeScript compiler infers types → zero code generation needed
 */
export const trpc = createTRPCReact<AppRouter>();
