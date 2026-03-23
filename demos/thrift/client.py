"""
Apache Thrift — Client Implementation
Topic 1: Apache Thrift Study

This demonstrates "location transparency":
calling remoteSum() looks exactly like a local function call,
but the execution happens on the server over TCP.

RUN (after starting server.py):
  python client.py
"""

import sys
import os
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "gen-py"))

from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol

# Import generated Client Stub
from sum_service import MathService
from sum_service.ttypes import MathRequest, DivisionByZeroException


def run():
    # ── RPC Runtime: connect to the server ───────────────────────────────────
    transport = TSocket.TSocket("localhost", 9090)
    transport = TTransport.TBufferedTransport(transport)
    protocol = TBinaryProtocol.TBinaryProtocol(transport)

    # Client Stub — generated automatically by: thrift --gen py sum_service.thrift
    # This stub handles all marshalling/unmarshalling transparently.
    client = MathService.Client(protocol)

    transport.open()

    print("=== Apache Thrift Math Service — Client ===")
    print("Connected to localhost:9090 (Binary protocol over TCP)\n")

    # ── remote_sum(5, 10) — the course example ────────────────────────────────
    # This call looks LOCAL, but it:
    # 1. Marshals MathRequest to binary (Thrift Binary Protocol)
    # 2. Sends over TCP to port 9090
    # 3. Server unmarshals, calls remoteSum(), marshals MathResult
    # 4. Client receives and unmarshals → typed MathResult object
    print("Calling remoteSum(5, 10)...")
    result = client.remoteSum(MathRequest(a=5, b=10))
    print(f"  {result.expression} = {result.result}")
    print(f"  Operation: {result.operation}\n")

    # ── More operations ───────────────────────────────────────────────────────
    print("Calling remoteMultiply(6, 7)...")
    result = client.remoteMultiply(MathRequest(a=6, b=7))
    print(f"  {result.expression} = {result.result}\n")

    print("Calling remoteSubtract(20, 8)...")
    result = client.remoteSubtract(MathRequest(a=20, b=8))
    print(f"  {result.expression} = {result.result}\n")

    print("Calling remoteDivide(22, 7)...")
    result = client.remoteDivide(MathRequest(a=22, b=7))
    print(f"  {result.expression} ≈ {result.result:.6f}\n")

    # ── Typed exception propagation ──────────────────────────────────────────
    # The server raises DivisionByZeroException, Thrift marshals it,
    # sends it over TCP, and re-raises it here as a typed exception.
    # This is a key advantage over JSON-RPC (which uses generic error codes).
    print("Calling remoteDivide(10, 0) — expects DivisionByZeroException...")
    try:
        client.remoteDivide(MathRequest(a=10, b=0))
    except DivisionByZeroException as e:
        print(f"  Caught typed exception: {e.message}")
        print("  ✓ Exception propagated across TCP as binary — fully typed!\n")

    # ── Server info ──────────────────────────────────────────────────────────
    info_raw = client.getServerInfo()
    info = json.loads(info_raw)
    print("Server info:")
    for k, v in info.items():
        print(f"  {k}: {v}")

    transport.close()

    print("\n=== Thrift vs tRPC summary ===")
    print("  IDL:       .thrift file        vs TypeScript types")
    print("  Stubs:     thrift compiler     vs zero-gen inference")
    print("  Transport: TCP binary          vs HTTP/JSON")
    print("  Languages: C++/Java/Python/Go  vs TypeScript only")
    print("  Exceptions: typed, binary      vs TRPCError (JSON)")


if __name__ == "__main__":
    run()
