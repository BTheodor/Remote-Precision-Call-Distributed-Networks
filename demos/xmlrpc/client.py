"""
XML-RPC — Client Implementation
Topic 3: XML-RPC Sum Service

ServerProxy = the "Client Stub" — dynamic and auto-generated at runtime.
No code generation step needed (unlike gRPC/Thrift).

RUN (after starting server.py):
  python client.py
"""

import xmlrpc.client


def run():
    # ── Client Stub: ServerProxy ──────────────────────────────────────────────
    # ServerProxy intercepts method calls and wraps them in XML automatically.
    # This is the "Client Stub" — created dynamically, no .proto needed.
    proxy = xmlrpc.client.ServerProxy("http://localhost:8000/", verbose=False)

    print("=== XML-RPC Math Service — Client ===")
    print("Connected to http://localhost:8000/\n")

    # ── remote_sum(5, 10) — the course example ────────────────────────────────
    # Under the hood, this sends an HTTP POST with an XML body:
    #
    # POST http://localhost:8000/
    # <?xml version='1.0'?>
    # <methodCall>
    #   <methodName>remote_sum</methodName>
    #   <params>
    #     <param><value><double>5</double></value></param>
    #     <param><value><double>10</double></value></param>
    #   </params>
    # </methodCall>
    print("Calling remote_sum(5, 10)...")
    result = proxy.remote_sum(5, 10)
    print(f"  {result['expression']} = {result['result']}\n")

    # ── More operations ───────────────────────────────────────────────────────
    print("Calling remote_multiply(6, 7)...")
    result = proxy.remote_multiply(6, 7)
    print(f"  {result['expression']} = {result['result']}\n")

    print("Calling remote_subtract(20, 8)...")
    result = proxy.remote_subtract(20, 8)
    print(f"  {result['expression']} = {result['result']}\n")

    print("Calling remote_divide(22, 7)...")
    result = proxy.remote_divide(22, 7)
    print(f"  {result['expression']} = {result['result']:.6f}\n")

    # ── Error handling ────────────────────────────────────────────────────────
    # The server raises ValueError → sent as XML-RPC Fault over HTTP:
    # <methodResponse>
    #   <fault><value><struct>
    #     <member><name>faultCode</name><value><int>1</int></value></member>
    #     <member><name>faultString</name><value><string>...</string></value></member>
    #   </struct></value></fault>
    # </methodResponse>
    print("Calling remote_divide(10, 0) — expects XML-RPC Fault...")
    try:
        proxy.remote_divide(10, 0)
    except xmlrpc.client.Fault as fault:
        print(f"  XML-RPC Fault [{fault.faultCode}]: {fault.faultString}")
        print("  ✓ Error propagated as XML over HTTP!\n")

    # ── Introspection ─────────────────────────────────────────────────────────
    # system.listMethods() is a standard XML-RPC introspection call.
    # The server self-describes — no IDL file needed on the client.
    print("Server methods (introspection via system.listMethods()):")
    methods = proxy.system.listMethods()
    for m in methods:
        if not m.startswith("system."):
            print(f"  - {m}")

    print("\nServer info:")
    info = proxy.get_server_info()
    for k, v in info.items():
        print(f"  {k}: {v}")

    print("\n=== XML-RPC vs gRPC summary ===")
    print("  Setup:    Immediate (no .proto, no compile) vs Requires compilation")
    print("  Format:   XML (human-readable, bulky)       vs Protobuf (binary, compact)")
    print("  Safety:   Dynamic (no type checking)        vs Strict (compile-time)")
    print("  Stubs:    Dynamic ServerProxy               vs Generated code")
    print("  Dep.:     Zero (Python stdlib)              vs pip install grpcio")


if __name__ == "__main__":
    run()
