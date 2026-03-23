/**
 * ========================================
 *  Math Router — "Server Program" (real logic)
 * ========================================
 *
 *  MAPPING TO RPC THEORY:
 *  ──────────────────────
 *  This file = "Server Program" in the RPC architecture
 *
 *  Here we define the REAL procedures the client calls.
 *  From the client's perspective, `trpc.math.remoteSum.query({ a: 5, b: 10 })`
 *  looks like a local call — but it executes on the server!
 *
 *  Complete flow:
 *  1. Client calls remoteSum({ a: 5, b: 10 })
 *  2. tRPC Client (Client Stub) → MARSHALLING → JSON: {"a":5,"b":10}
 *  3. HTTP fetch (RPC Runtime) → sends request to /api/trpc/math.remoteSum
 *  4. tRPC Server (Server Stub) → UNMARSHALLING → Zod validation → { a: 5, b: 10 }
 *  5. The handler below executes → returns 15
 *  6. Reverse Flow: result marshalled → HTTP response → unmarshalled on client
 */

import { z } from "zod";
import { router, loggedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const mathRouter = router({
  /**
   * ─── remote_sum(a, b) ───
   *
   * Example: remote_sum(5, 10)
   *
   * Zod schema = "IDL contract" (Interface Definition Language)
   * Instead of a separate .proto file, we define types inline.
   * TypeScript + Zod = type-safety at COMPILE TIME + RUNTIME validation.
   *
   * .input(z.object({...}))  → defines the "contract" (marshalling format)
   * .query(...)              → READ operation (like GET in REST)
   */
  remoteSum: loggedProcedure
    .input(
      z.object({
        a: z.number().describe("First operand"),
        b: z.number().describe("Second operand"),
      })
    )
    .query(({ input, ctx }) => {
      // ctx = Context (requestId, timestamp) — metadata from Server Stub
      console.log(`  → [${ctx.requestId}] Computing ${input.a} + ${input.b}`);

      const result = input.a + input.b;

      return {
        operation: "sum",
        expression: `${input.a} + ${input.b}`,
        result,
        // Useful metadata for RPC debugging
        meta: {
          executedAt: ctx.timestamp,
          requestId: ctx.requestId,
          executionTime: `${Date.now() - ctx.timestamp.getTime()}ms`,
        },
      };
    }),

  /**
   * ─── remote_divide(a, b) ───
   *
   * Demonstrates ERROR HANDLING in RPC.
   *
   * From "Critical Design Considerations":
   * "Unlike local calls, RPCs can fail due to Network Timeout or Server Down.
   *  Your code must handle these exceptions explicitly."
   *
   * tRPC uses TRPCError with standard HTTP codes.
   */
  remoteDivide: loggedProcedure
    .input(
      z.object({
        a: z.number(),
        b: z.number(),
      })
    )
    .query(({ input }) => {
      // Error handling — server throws structured error
      if (input.b === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Division by zero is not allowed!",
          cause: { dividend: input.a, divisor: input.b },
        });
      }

      return {
        operation: "divide",
        expression: `${input.a} / ${input.b}`,
        result: input.a / input.b,
      };
    }),

  /**
   * ─── remote_batch ───
   *
   * Demonstrates complex operations — sending multiple calculations at once.
   * tRPC supports "batching" natively via httpBatchLink.
   *
   * .mutation() = WRITE operation (like POST in REST)
   * We use mutation here because we are processing a complex operation.
   */
  remoteBatch: loggedProcedure
    .input(
      z.object({
        operations: z.array(
          z.object({
            type: z.enum(["sum", "subtract", "multiply", "divide"]),
            a: z.number(),
            b: z.number(),
          })
        ),
      })
    )
    .mutation(({ input }) => {
      const results = input.operations.map((op) => {
        let result: number;
        switch (op.type) {
          case "sum":
            result = op.a + op.b;
            break;
          case "subtract":
            result = op.a - op.b;
            break;
          case "multiply":
            result = op.a * op.b;
            break;
          case "divide":
            if (op.b === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Division by zero" });
            result = op.a / op.b;
            break;
        }
        return { ...op, result };
      });

      return { results, count: results.length };
    }),

  /**
   * ─── getServerInfo ───
   *
   * Procedure without input — demonstrates that not all RPCs have arguments.
   * Returns info about the "server program" concept.
   */
  getServerInfo: loggedProcedure.query(({ ctx }) => {
    return {
      name: "Math RPC Service",
      version: "1.0.0",
      uptime: process.uptime(),
      requestId: ctx.requestId,
      availableProcedures: ["remoteSum", "remoteDivide", "remoteBatch"],
    };
  }),
});
