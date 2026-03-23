/**
 * ========================================
 *  Root Router — Serviciul RPC principal
 * ========================================
 *
 *  Acest fișier combină toate sub-router-urile într-un singur "serviciu".
 *
 *  Echivalent în gRPC: ar fi un .proto file cu mai multe `service` blocks.
 *  În tRPC: importăm router-uri și le compunem într-un arbore de proceduri.
 *
 *  Structura finală:
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
 *  IMPORTANT: `AppRouter` type este exportat → acesta este "IDL-ul" tRPC.
 *  Clientul importă DOAR acest type (nu codul!) pentru full type-safety.
 */

import { router } from "../trpc";
import { mathRouter } from "./math";
import { todoRouter } from "./todo";

export const appRouter = router({
  math: mathRouter,
  todo: todoRouter,
});

// Exportă TYPE-ul router-ului → ACESTA este "contractul" (IDL)
// Clientul îl importă pentru type inference automată
export type AppRouter = typeof appRouter;
