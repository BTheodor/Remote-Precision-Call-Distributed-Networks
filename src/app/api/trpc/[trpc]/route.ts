/**
 * ========================================
 *  API Route Handler — "RPC Runtime" (transport layer)
 * ========================================
 *
 *  MAPARE PE TEORIA RPC:
 *  ─────────────────────
 *  Acest fișier = "RPC Runtime" din ambele părți (client + server)
 *
 *  Ce face:
 *  1. Primește HTTP requests de la Client Runtime (fetch API)
 *  2. Le decodează (unmarshalling) prin tRPC
 *  3. Le routează către procedura corectă (math.remoteSum, todo.create, etc.)
 *  4. Returnează rezultatul ca HTTP response (marshalling)
 *
 *  URL pattern: /api/trpc/[trpc]
 *  Exemple:
 *  - GET  /api/trpc/math.remoteSum?input={"a":5,"b":10}
 *  - POST /api/trpc/todo.create  body: {"title":"Learn RPC"}
 *
 *  tRPC gestionează tot acest transport AUTOMAT — nu scrii manual
 *  fetch(), JSON.parse(), sau route matching.
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(),

    // Error formatting — personalizăm erorile trimise clientului
    onError: ({ error, path }) => {
      console.error(`[RPC ERROR] ${path}:`, error.message);
    },
  });

// Next.js App Router exports
export { handler as GET, handler as POST };
