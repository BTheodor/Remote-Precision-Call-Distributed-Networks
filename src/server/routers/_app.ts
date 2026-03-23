/**
 * ========================================
 *  Root Router — Main RPC Service
 * ========================================
 *
 *  This file combines all sub-routers into a single "service".
 *
 *  gRPC equivalent: a .proto file with multiple `service` blocks.
 *  In tRPC: we import routers and compose them into a procedure tree.
 *
 *  Final structure:
 *  └── appRouter
 *      ├── math
 *      │   ├── remoteSum        (query)
 *      │   ├── remoteDivide     (query)
 *      │   ├── remoteBatch      (mutation)
 *      │   └── getServerInfo    (query)
 *      └── todo
 *          ├── list             (query)
 *          ├── getById          (query)
 *          ├── create           (mutation)
 *          ├── update           (mutation)
 *          ├── delete           (mutation)
 *          └── toggleComplete   (mutation)
 *
 *  IMPORTANT: `AppRouter` type is exported → this is the tRPC "IDL".
 *  The client imports ONLY this type (not the code!) for full type-safety.
 */

import { router } from "../trpc";
import { mathRouter } from "./math";
import { todoRouter } from "./todo";

export const appRouter = router({
  math: mathRouter,
  todo: todoRouter,
});

// Export the router TYPE → this IS the "contract" (IDL)
// The client imports it for automatic type inference
export type AppRouter = typeof appRouter;
