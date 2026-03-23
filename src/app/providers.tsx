/**
 * ========================================
 *  Provider — "RPC Runtime" Configuration (client-side)
 * ========================================
 *
 *  httpBatchLink = transport layer
 *  Combines multiple RPC calls into a single HTTP request!
 *
 *  Example: if the page simultaneously calls:
 *  - trpc.math.getServerInfo.useQuery()
 *  - trpc.todo.list.useQuery()
 *
 *  → tRPC combines them into ONE HTTP request (batching)
 *  → Reduces latency and network connections
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
        // Retry logic — important for RPC!
        // "networks fail, clients often retry calls"
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
