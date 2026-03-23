# Remote-Precision-Call-Distributed-Networks

Remote Procedure Call implementation using tRPC v11 + Next.js 14 + Zod. Educational project mapping core RPC theory (marshalling, stubs, IDL, idempotency) to a working full-stack TypeScript app. Includes a math service (remote\_sum, remote\_divide, batch operations) and a CRUD todo service with idempotency patterns and structured error handling.



RPC Implementation for Distributed Networks



A hands-on educational project that bridges RPC theory with modern practice. Each file is annotated with comments mapping code to core RPC concepts: Client Program → Client Stub → RPC Runtime → Server Stub → Server Program.



Stack: tRPC v11 · Next.js 14 (App Router) · Zod · SuperJSON · React Query



Features:

• Math service — remote\_sum, remote\_divide, batch operations

• Todo CRUD — mutations with idempotency keys

• Structured error handling (TRPCError propagation)

• Logging middleware (RPC interceptor pattern)

• Request batching via httpBatchLink



npm install → npm run dev → http://localhost:3000

