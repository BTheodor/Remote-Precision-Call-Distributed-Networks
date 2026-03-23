"""
XML-RPC — Server Implementation
Topic 3: XML-RPC Sum Service

No stubs, no .proto files, no compilation needed.
Uses Python's built-in xmlrpc library (zero external dependencies).

Protocol: XML over HTTP (human-readable payload, unlike gRPC/Thrift binary)

RUN:
  python server.py

Then run client.py in a separate terminal.
"""

from xmlrpc.server import SimpleXMLRPCServer
import datetime


# ─── Server Program: Math Functions ──────────────────────────────────────────
# These are regular Python functions — no special decorators needed.
# SimpleXMLRPCServer wraps them and handles the HTTP+XML transport.

def remote_sum(a, b):
    """remote_sum(a, b) — the course example: result = remote_sum(5, 10)"""
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] remote_sum({a}, {b})")
    return {"result": a + b, "expression": f"{a} + {b}", "operation": "sum"}


def remote_divide(a, b):
    """remote_divide(a, b) — error sent as XML-RPC Fault over HTTP."""
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] remote_divide({a}, {b})")
    if b == 0:
        # Raised as xmlrpc.client.Fault on the client side
        raise ValueError("Division by zero is not allowed")
    return {"result": a / b, "expression": f"{a} / {b}", "operation": "divide"}


def remote_multiply(a, b):
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] remote_multiply({a}, {b})")
    return {"result": a * b, "expression": f"{a} * {b}", "operation": "multiply"}


def remote_subtract(a, b):
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] remote_subtract({a}, {b})")
    return {"result": a - b, "expression": f"{a} - {b}", "operation": "subtract"}


def get_server_info():
    return {
        "service": "Math XML-RPC Service",
        "version": "1.0.0",
        "protocol": "XML-RPC over HTTP",
        "port": 8000,
        "procedures": ["remote_sum", "remote_divide", "remote_multiply", "remote_subtract"],
    }


# ─── Server Setup ─────────────────────────────────────────────────────────────
server = SimpleXMLRPCServer(("localhost", 8000), allow_none=True, logRequests=True)

print("Math XML-RPC Server running on http://localhost:8000/")
print("Protocol: XML over HTTP (human-readable, unlike gRPC binary)")
print("Architecture: Client → ServerProxy → [HTTP POST :8000] → SimpleXMLRPCServer → Function")
print("\nAvailable methods: remote_sum, remote_divide, remote_multiply, remote_subtract")
print("Press Ctrl+C to stop.\n")

# Register functions (equivalent to "exposing" procedures)
server.register_function(remote_sum, "remote_sum")
server.register_function(remote_divide, "remote_divide")
server.register_function(remote_multiply, "remote_multiply")
server.register_function(remote_subtract, "remote_subtract")
server.register_function(get_server_info, "get_server_info")

# Adds system.listMethods(), system.methodHelp(), system.methodSignature()
server.register_introspection_functions()

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopping...")
