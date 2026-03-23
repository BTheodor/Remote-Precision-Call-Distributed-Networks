/**
 * ========================================
 *  Todo Router — CRUD cu RPC
 * ========================================
 *
 *  Demonstrates advanced concepts:
 *
 *  1. IDEMPOTENCY (Critical Design Considerations):
 *     "Ensure that calling a function twice doesn't cause duplicate side effects."
 *     → We use unique IDs + duplicate checks
 *
 *  2. Query vs Mutation:
 *     → query()    = read (GET)   — IDEMPOTENT by default
 *     → mutation() = write (POST) — idempotency must be managed manually
 *
 *  3. Error Handling:
 *     → Structured errors with specific codes (NOT_FOUND, CONFLICT, etc.)
 */

import { z } from "zod";
import { router, loggedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// ─── In-memory "database" (for educational purposes) ───
// In a real application, this would be Prisma/Drizzle → PostgreSQL/SQLite
type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const todos: Map<string, Todo> = new Map();

// Pre-populate with demo data
const demoTodos = [
  { title: "Study tRPC and Apache Thrift", completed: false },
  { title: "Understand marshalling/unmarshalling", completed: true },
  { title: "Implement RPC error handling", completed: false },
];

demoTodos.forEach((t, i) => {
  const id = `todo-${i + 1}`;
  todos.set(id, {
    id,
    title: t.title,
    completed: t.completed,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

export const todoRouter = router({
  /**
   * ─── LIST todos ───
   * Query = Read = Idempotent (you can call it 100 times, same result)
   */
  list: loggedProcedure
    .input(
      z
        .object({
          completed: z.boolean().optional(), // optional filter
        })
        .optional()
    )
    .query(({ input }) => {
      let result = Array.from(todos.values());

      if (input?.completed !== undefined) {
        result = result.filter((t) => t.completed === input.completed);
      }

      return {
        todos: result,
        total: result.length,
      };
    }),

  /**
   * ─── GET by ID ───
   * Demonstrates error handling: what happens when the resource doesn't exist?
   *
   * Classic RPC equivalent: Server throws exception → Server Stub marshals it
   * → sent over the network → Client Stub unmarshals it → error on client.
   */
  getById: loggedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const todo = todos.get(input.id);

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Todo with ID "${input.id}" was not found.`,
        });
      }

      return todo;
    }),

  /**
   * ─── CREATE todo ───
   * Mutation = Write = NON-idempotent (called twice → 2 todos!)
   *
   * IDEMPOTENCY PATTERN:
   * We send an optional `clientId` — if the client resends
   * the same request (retry after network timeout), the server checks
   * if a todo with that clientId already exists.
   */
  create: loggedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title cannot be empty").max(200),
        clientId: z.string().optional(), // for idempotency!
      })
    )
    .mutation(({ input }) => {
      // IDEMPOTENCY CHECK: if clientId already exists, return the existing todo
      if (input.clientId) {
        const existing = Array.from(todos.values()).find(
          (t) => t.id === input.clientId
        );
        if (existing) {
          console.log(`  → Idempotency: Todo "${input.clientId}" already exists, skipping duplicate`);
          return { todo: existing, created: false, message: "Already exists (idempotent)" };
        }
      }

      const id = input.clientId || `todo-${Date.now()}`;
      const todo: Todo = {
        id,
        title: input.title,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      todos.set(id, todo);

      return { todo, created: true, message: "Created successfully" };
    }),

  /**
   * ─── UPDATE todo ───
   * Mutation with partial update
   */
  update: loggedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const todo = todos.get(input.id);

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Todo "${input.id}" does not exist.`,
        });
      }

      // Partial update
      if (input.title !== undefined) todo.title = input.title;
      if (input.completed !== undefined) todo.completed = input.completed;
      todo.updatedAt = new Date();

      todos.set(input.id, todo);

      return todo;
    }),

  /**
   * ─── DELETE todo ───
   * Mutation with natural idempotency:
   * If you delete something that doesn't exist → not an error, just "nothing changed"
   */
  delete: loggedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const existed = todos.delete(input.id);
      return {
        deleted: existed,
        message: existed ? "Deleted" : "Not found (already deleted?)",
      };
    }),

  /**
   * ─── TOGGLE completed ───
   * Demonstrates a common pattern: specific operation vs. generic update
   */
  toggleComplete: loggedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const todo = todos.get(input.id);
      if (!todo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }

      todo.completed = !todo.completed;
      todo.updatedAt = new Date();
      todos.set(input.id, todo);

      return todo;
    }),
});
