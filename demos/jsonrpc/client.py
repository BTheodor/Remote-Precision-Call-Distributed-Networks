"""
JSON-RPC 2.0 — Client Implementation (Python / TCP Sockets)
Topic 4: JSON-RPC Sum Service

The `id` field is crucial: it links each response to its request,
which is essential for async and batch scenarios.

RUN (after starting server.py):
  python client.py

Or test manually with netcat:
  echo '{"jsonrpc":"2.0","method":"math.sum","params":[5,10],"id":1}' | nc localhost 5000
"""

import socket
import json


def call_rpc(method: str, params: list, req_id: int = 1) -> dict:
    """Send a single JSON-RPC 2.0 request and return the parsed response."""
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(("localhost", 5000))

    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": req_id,  # Links this response to this specific request
    }

    client.send(json.dumps(payload).encode("utf-8"))
    raw = client.recv(4096).decode("utf-8")
    client.close()

    return json.loads(raw)


def run():
    print("=== JSON-RPC 2.0 Math Service — Client ===")
    print("Connected to localhost:5000 (JSON over TCP)\n")

    # ── math.sum(5, 10) — the course example ─────────────────────────────────
    print("Calling math.sum(5, 10)...")
    resp = call_rpc("math.sum", [5, 10], req_id=1)
    if "result" in resp:
        r = resp["result"]
        print(f"  {r['expression']} = {r['result']}")
    print(f"  Raw: {json.dumps(resp)}\n")

    # ── Division ──────────────────────────────────────────────────────────────
    print("Calling math.divide(22, 7)...")
    resp = call_rpc("math.divide", [22, 7], req_id=2)
    if "result" in resp:
        r = resp["result"]
        print(f"  {r['expression']} ≈ {r['result']:.6f}")
    print(f"  Raw: {json.dumps(resp)}\n")

    # ── Multiply ──────────────────────────────────────────────────────────────
    print("Calling math.multiply(6, 7)...")
    resp = call_rpc("math.multiply", [6, 7], req_id=3)
    if "result" in resp:
        r = resp["result"]
        print(f"  {r['expression']} = {r['result']}")
    print(f"  Raw: {json.dumps(resp)}\n")

    # ── Error: division by zero ───────────────────────────────────────────────
    print("Calling math.divide(10, 0) — expects error...")
    resp = call_rpc("math.divide", [10, 0], req_id=4)
    if "error" in resp:
        print(f"  JSON-RPC Error (code {resp['error']['code']}): {resp['error']['message']}")
        print("  ✓ Structured error propagated as JSON!\n")

    # ── Method not found ──────────────────────────────────────────────────────
    print("Calling math.modulo(10, 3) — method not registered...")
    resp = call_rpc("math.modulo", [10, 3], req_id=5)
    print(f"  Error: {resp['error']}\n")

    # ── Manual test with netcat ───────────────────────────────────────────────
    print("=== Manual test (netcat) ===")
    print("  echo '{\"jsonrpc\":\"2.0\",\"method\":\"math.sum\",\"params\":[5,10],\"id\":1}' | nc localhost 5000")
    print("  echo '{\"jsonrpc\":\"2.0\",\"method\":\"non_existent\",\"id\":2}' | nc localhost 5000")

    print("\n=== JSON-RPC 2.0 payload structure ===")
    print("  Request:  { jsonrpc, method, params, id }")
    print("  Success:  { jsonrpc, result, id }")
    print("  Error:    { jsonrpc, error: { code, message }, id }")
    print("  Batch:    [ {req1}, {req2}, ... ] → [ {resp1}, {resp2}, ... ]")


if __name__ == "__main__":
    run()
