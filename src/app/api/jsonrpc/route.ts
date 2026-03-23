/**
 * ========================================
 *  JSON-RPC 2.0 — Next.js API Route
 *  Topic 4: JSON-RPC Sum Service (Live Endpoint)
 * ========================================
 *
 *  This implements the JSON-RPC 2.0 specification over HTTP.
 *  Unlike tRPC (which wraps everything), this is a raw JSON-RPC endpoint.
 *
 *  POST /api/jsonrpc
 *  Body (single):  { "jsonrpc": "2.0", "method": "math.sum", "params": [5, 10], "id": 1 }
 *  Body (batch):   [ { ...req1 }, { ...req2 }, { ...req3 } ]
 *
 *  Supported methods:
 *    math.sum(a, b)      → a + b
 *    math.divide(a, b)   → a / b  (errors on b = 0)
 *    math.multiply(a, b) → a * b
 *    math.subtract(a, b) → a - b
 *
 *  JSON-RPC 2.0 error codes:
 *    -32600  Invalid Request
 *    -32601  Method not found
 *    -32602  Invalid params
 *    -32603  Internal error
 *    -32700  Parse error
 */

type JsonRpcRequest = {
  jsonrpc: string;
  method: string;
  params?: number[];
  id: number | string | null;
};

type JsonRpcSuccess = {
  jsonrpc: "2.0";
  result: unknown;
  id: number | string | null;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  error: { code: number; message: string };
  id: number | string | null;
};

type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

// ─── Method Registry ─────────────────────────────────────────────────────────
// "Server Program" — the actual logic. Add new methods here.
const METHODS: Record<string, (a: number, b: number) => unknown> = {
  "math.sum": (a, b) => ({
    result: a + b,
    expression: `${a} + ${b}`,
    operation: "sum",
  }),
  "math.divide": (a, b) => {
    if (b === 0) throw { code: -32602, message: "Division by zero is not allowed" };
    return { result: a / b, expression: `${a} / ${b}`, operation: "divide" };
  },
  "math.multiply": (a, b) => ({
    result: a * b,
    expression: `${a} * ${b}`,
    operation: "multiply",
  }),
  "math.subtract": (a, b) => ({
    result: a - b,
    expression: `${a} - ${b}`,
    operation: "subtract",
  }),
};

// ─── Single Request Handler ───────────────────────────────────────────────────
function handleSingle(req: JsonRpcRequest): JsonRpcResponse {
  const { jsonrpc, method, params = [], id = null } = req;

  if (jsonrpc !== "2.0") {
    return {
      jsonrpc: "2.0",
      error: { code: -32600, message: "Invalid Request: jsonrpc must be '2.0'" },
      id,
    };
  }

  const fn = METHODS[method];
  if (!fn) {
    return {
      jsonrpc: "2.0",
      error: { code: -32601, message: `Method not found: '${method}'` },
      id,
    };
  }

  const [a, b] = params as [number, number];
  if (typeof a !== "number" || typeof b !== "number") {
    return {
      jsonrpc: "2.0",
      error: { code: -32602, message: "Invalid params: expected [number, number]" },
      id,
    };
  }

  try {
    const result = fn(a, b);
    return { jsonrpc: "2.0", result, id };
  } catch (err: unknown) {
    const e = err as { code?: number; message?: string };
    return {
      jsonrpc: "2.0",
      error: { code: e.code ?? -32603, message: e.message ?? "Internal error" },
      id,
    };
  }
}

// ─── POST — Single or Batch ───────────────────────────────────────────────────
export async function POST(req: Request) {
  const body = await req.json();

  // Batch request: array of JSON-RPC request objects
  if (Array.isArray(body)) {
    const results = body.map((item) => handleSingle(item as JsonRpcRequest));
    return Response.json(results);
  }

  // Single request
  return Response.json(handleSingle(body as JsonRpcRequest));
}

// ─── GET — Service introspection ──────────────────────────────────────────────
export async function GET() {
  return Response.json({
    service: "JSON-RPC 2.0 Math Service",
    version: "1.0.0",
    endpoint: "/api/jsonrpc",
    methods: Object.keys(METHODS),
    spec: "https://www.jsonrpc.org/specification",
    note: "POST a JSON-RPC 2.0 request object, or an array for batching.",
  });
}
