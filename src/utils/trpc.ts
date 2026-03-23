/**
 * ========================================
 *  tRPC Client — "Client Stub" (auto-generat!)
 * ========================================
 *
 *  MAPARE PE TEORIA RPC:
 *  ─────────────────────
 *  Acest fișier = "Client Stub" din arhitectura RPC
 *
 *  Din curs: "A proxy that pretends to be the remote function.
 *  It collects arguments and packages them (Marshalling)."
 *
 *  MAGIA tRPC: acest stub este GENERAT AUTOMAT din AppRouter type.
 *  Nu scrii manual serializare sau deserializare!
 *
 *  Când scrii:  trpc.math.remoteSum.useQuery({ a: 5, b: 10 })
 *  tRPC face:
 *  1. Verifică TIPURILE la compile time (a: number, b: number)
 *  2. Serializează input-ul → JSON (marshalling)
 *  3. Trimite HTTP request → /api/trpc/math.remoteSum
 *  4. Primește response, deserializează → TypeScript object (unmarshalling)
 *  5. Returnează result cu TYPE corect automat!
 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

/**
 * `trpc` este CLIENT STUB-ul nostru.
 *
 * Observă: importăm doar TYPE-ul AppRouter (nu codul server!).
 * TypeScript types sunt "erased" la compilare — zero server code pe client.
 * Dar avem full autocomplete + type checking!
 *
 * Asta e echivalentul modern al "stub generation" din gRPC:
 * - gRPC: protoc compilează .proto → generează client stubs
 * - tRPC: TypeScript compiler inferă types → zero code generation needed
 */
export const trpc = createTRPCReact<AppRouter>();
