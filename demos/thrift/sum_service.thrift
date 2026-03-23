/**
 * Apache Thrift IDL — Math Sum Service
 * Topic 1: Apache Thrift Study
 *
 * This file is the "contract" (IDL) between client and server.
 * Equivalent to .proto files in gRPC, or TypeScript types in tRPC.
 *
 * Generate Python stubs:
 *   thrift --gen py sum_service.thrift
 *
 * Generated files (in gen-py/sum_service/):
 *   MathService.py      ← Client Stub + Server interface
 *   ttypes.py           ← Data structures (MathRequest, MathResult, ...)
 *   constants.py        ← Constants
 */

namespace py sum_service
namespace java com.example.sum_service
namespace cpp sum_service

// ─── Data Structures ─────────────────────────────────────────────────────────

struct MathRequest {
  1: required double a,   // First operand
  2: required double b,   // Second operand
}

struct MathResult {
  1: required double result,
  2: required string expression,  // e.g. "5.0 + 10.0"
  3: required string operation,   // "sum" | "divide" | "multiply" | "subtract"
}

// ─── Exceptions ───────────────────────────────────────────────────────────────
// Typed exceptions — propagated across the network as structured data.
// This is one of Thrift's advantages over JSON-RPC (where errors are generic).

exception DivisionByZeroException {
  1: required string message,
}

exception InvalidInputException {
  1: required string message,
  2: optional string field,
}

// ─── Service Definition ───────────────────────────────────────────────────────
// This is the "IDL" that both client and server agree on.
// The Thrift compiler generates stubs in Python, Java, C++, Go, etc.

service MathService {
  /**
   * remote_sum(a, b) — the course example: result = remote_sum(5, 10)
   * Calling this from the client looks like a local function call.
   * Under the hood: marshalled to binary, sent over TCP, unmarshalled on server.
   */
  MathResult remoteSum(1: MathRequest request),

  /**
   * remote_divide(a, b) — demonstrates typed exception handling.
   * The exception is serialized and propagated across the network,
   * then re-raised as a typed exception on the client side.
   */
  MathResult remoteDivide(1: MathRequest request)
    throws (1: DivisionByZeroException divErr),

  MathResult remoteMultiply(1: MathRequest request),

  MathResult remoteSubtract(1: MathRequest request),

  /**
   * getServerInfo() — no input, demonstrates procedures without arguments.
   */
  string getServerInfo(),
}
