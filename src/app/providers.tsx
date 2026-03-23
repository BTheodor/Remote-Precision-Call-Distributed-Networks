/**
 * ========================================
 *  Provider — Configurare "RPC Runtime" (client-side)
 * ========================================
 *
 *  httpBatchLink = transport layer
 *  Combină mai multe RPC calls într-un singur HTTP request!
 *
 *  Ex: dacă pagina apelează simultan:
 *  - trpc.math.getServerInfo.useQuery()
 *  - trpc.todo.list.useQuery()
 *
 *  → tRPC le combină într-UN SINGUR request HTTP (batching)
 *  → Reduce latența și conexiunile de rețea
 */

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/utils/trpc";
import superjson from "superjson";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Retry logic — important pentru RPC!
        // Din curs: "networks fail, clients often retry calls"
        retry: 2,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
