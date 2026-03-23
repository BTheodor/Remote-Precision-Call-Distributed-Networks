"""
JSON-RPC 2.0 — Server Implementation (Python / TCP Sockets)
Topic 4: JSON-RPC Sum Service (Python reference implementation)

Note: This project also has a live JSON-RPC endpoint at /api/jsonrpc
built directly into Next.js. This Python version is the reference
implementation showing the raw socket-level protocol.

RPC Architecture:
  Client → JSON payload → [TCP:5000] → Dispatcher → Function → JSON response

RUN:
  python server.py

Then run client.py in a separate terminal, or use the Next.js live demo.
"""

import socket
import json


# ─── Method Registry ──────────────────────────────────────────────────────────
# "Server Program" — the actual business logic.

def remote_sum(a, b):
    return {"result": a + b, "expression": f"{a} + {b}", "operation": "sum"}


def remote_divide(a, b):
    if b == 0:
        raise ValueError("Division by zero is not allowed")
    return {"result": a / b, "expression": f"{a} / {b}", "operation": "divide"}


def remote_multiply(a, b):
    return {"result": a * b, "expression": f"{a} * {b}", "operation": "multiply"}


def remote_subtract(a, b):
    return {"result": a - b, "expression": f"{a} - {b}", "operation": "subtract"}


METHODS = {
    "math.sum": remote_sum,
    "math.divide": remote_divide,
    "math.multiply": remote_multiply,
    "math.subtract": remote_subtract,
}


# ─── JSON-RPC 2.0 Request Dispatcher ─────────────────────────────────────────

def handle_request(raw_data: str) -> dict:
    """Parse and dispatch a single JSON-RPC 2.0 request."""
    req_id = None
    try:
        request = json.loads(raw_data)
        req_id = request.get("id")
        method_name = request.get("method")
        params = request.get("params", [])

        if request.get("jsonrpc") != "2.0":
            return {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": req_id}

        fn = METHODS.get(method_name)
        if fn is None:
            return {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": req_id}

        result = fn(*params)
        return {"jsonrpc": "2.0", "result": result, "id": req_id}

    except (ValueError, TypeError) as e:
        return {"jsonrpc": "2.0", "error": {"code": -32602, "message": str(e)}, "id": req_id}
    except json.JSONDecodeError:
        return {"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}, "id": None}
    except Exception as e:
        return {"jsonrpc": "2.0", "error": {"code": -32603, "message": f"Internal error: {e}"}, "id": req_id}


# ─── TCP Server ───────────────────────────────────────────────────────────────

def start_server(host="localhost", port=5000):
    server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_sock.bind((host, port))
    server_sock.listen(5)

    print(f"JSON-RPC 2.0 Math Server running on {host}:{port}")
    print("Protocol: JSON over TCP sockets (human-readable)")
    print("Architecture: Client → JSON string → [TCP] → Dispatcher → Function → JSON response")
    print(f"Available methods: {', '.join(METHODS.keys())}")
    print("Press Ctrl+C to stop.\n")

    while True:
        conn, addr = server_sock.accept()
        try:
            raw_data = conn.recv(4096).decode("utf-8")
            if not raw_data:
                continue
            print(f"  → [{addr[0]}] Request: {raw_data.strip()}")
            response = handle_request(raw_data)
            conn.send(json.dumps(response).encode("utf-8"))
        finally:
            # Always close the connection, even if an error occurs
            conn.close()


if __name__ == "__main__":
    start_server()
