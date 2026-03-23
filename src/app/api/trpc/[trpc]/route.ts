/**
 * ========================================
 *  API Route Handler — "RPC Runtime" (transport layer)
 * ========================================
 *
 *  MAPPING TO RPC THEORY:
 *  ──────────────────────
 *  This file = "RPC Runtime" on both sides (client + server)
 *
 *  What it does:
 *  1. Receives HTTP requests from the Client Runtime (fetch API)
 *  2. Decodes them (unmarshalling) via tRPC
 *  3. Routes to the correct procedure (math.remoteSum, todo.create, etc.)
 *  4. Returns the result as an HTTP response (marshalling)
 *
 *  URL pattern: /api/trpc/[trpc]
 *  Examples:
 *  - GET  /api/trpc/math.remoteSum?input={"a":5,"b":10}
 *  - POST /api/trpc/todo.create  body: {"title":"Learn RPC"}
 *
 *  tRPC manages all this transport AUTOMATICALLY — you don't write
 *  fetch(), JSON.parse(), or route matching manually.
 */

// Required for Cloudflare Pages / Workers edge runtime
export const runtime = "edge";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(),

    // Error formatting — customize errors sent to the client
    onError: ({ error, path }) => {
      console.error(`[RPC ERROR] ${path}:`, error.message);
    },
  });

// Next.js App Router exports
export { handler as GET, handler as POST };
