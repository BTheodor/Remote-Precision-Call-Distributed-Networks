/**
 * ========================================
 *  Main Page — "Client Program"
 * ========================================
 *
 *  MAPPING TO RPC THEORY:
 *  ──────────────────────
 *  This file = "Client Program" — the application that calls remote procedures
 *
 *  "The application code that calls a procedure."
 *
 *  Notice how each tRPC call looks like a LOCAL call:
 *  - trpc.math.remoteSum.useQuery({ a, b })
 *  - trpc.todo.create.useMutation()
 *
 *  "Location transparency" — you don't know (and don't care) that the logic
 *  runs on another process/server. tRPC hides all the complexity.
 */

"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  container:    { maxWidth: 920, margin: "0 auto", padding: "2rem" },
  header:       { borderBottom: "1px solid #2a2a2a", paddingBottom: "1rem", marginBottom: "1rem" },
  h1:           { fontSize: "1.8rem", margin: 0, fontWeight: 600 },
  subtitle:     { color: "#888", marginTop: "0.5rem", fontSize: "0.9rem" },
  section:      { marginBottom: "2rem" },
  sectionTitle: { fontSize: "1.1rem", marginBottom: "1rem", color: "#60a5fa", fontWeight: 500 },
  card:         { background: "#161616", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" },
  input:        { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "0.5rem 0.75rem", color: "#eee", fontSize: "1rem", width: 80 } as React.CSSProperties,
  inputWide:    { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "0.5rem 0.75rem", color: "#eee", fontSize: "1rem", flex: 1 } as React.CSSProperties,
  button:       { background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 },
  buttonSm:     { background: "#333", color: "#ccc", border: "none", borderRadius: 6, padding: "0.3rem 0.8rem", cursor: "pointer", fontSize: "0.8rem" },
  buttonDanger: { background: "#7f1d1d", color: "#fca5a5", border: "none", borderRadius: 6, padding: "0.3rem 0.8rem", cursor: "pointer", fontSize: "0.8rem" },
  result:       { background: "#0d1f0d", border: "1px solid #1a3a1a", borderRadius: 8, padding: "1rem", fontFamily: "monospace", fontSize: "0.85rem", marginTop: "1rem", whiteSpace: "pre-wrap" as const },
  error:        { background: "#1f0d0d", border: "1px solid #3a1a1a", borderRadius: 8, padding: "1rem", color: "#f87171", marginTop: "1rem", fontSize: "0.85rem" },
  badge:        { display: "inline-block", background: "#1e3a5f", color: "#93c5fd", borderRadius: 4, padding: "0.15rem 0.5rem", fontSize: "0.75rem", marginLeft: "0.5rem" },
  row:          { display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" as const },
  todoItem:     { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderBottom: "1px solid #222" },
  label:        { color: "#888", fontSize: "0.85rem" },
  mono:         { fontFamily: "monospace", color: "#a78bfa" },
  // Topic dividers
  topicDivider: { borderTop: "2px solid #1e3a5f", paddingTop: "1.5rem", marginTop: "3rem", marginBottom: "1.5rem" },
  topicTitle:   { fontSize: "1.35rem", color: "#93c5fd", fontWeight: 700, margin: "0 0 0.2rem 0" },
  topicDesc:    { color: "#555", fontSize: "0.82rem", margin: 0 },
  // Code blocks
  code: {
    background: "#080808", border: "1px solid #1a3a1a", borderRadius: 8, padding: "1rem",
    fontFamily: "monospace", fontSize: "0.77rem", color: "#86efac",
    overflow: "auto", whiteSpace: "pre" as const, marginTop: "0.5rem", maxHeight: 270,
  },
  codeBlue: {
    background: "#06080f", border: "1px solid #1a2a50", borderRadius: 8, padding: "1rem",
    fontFamily: "monospace", fontSize: "0.77rem", color: "#93c5fd",
    overflow: "auto", whiteSpace: "pre" as const, marginTop: "0.5rem", maxHeight: 270,
  },
  codeLabel: { fontSize: "0.72rem", color: "#555", marginBottom: "0.2rem", marginTop: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  select:    { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "0.5rem 0.75rem", color: "#eee", fontSize: "0.9rem" } as React.CSSProperties,
  twoCol:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" } as React.CSSProperties,
  infoRow:   { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111", padding: "0.35rem 0", fontSize: "0.82rem" },
};

// ═══════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div style={S.container}>
      <header style={S.header}>
        <h1 style={S.h1}>
          RPC Implementation
          <span style={{ ...S.badge, background: "#1a2e1a", color: "#86efac" }}>tRPC v11</span>
        </h1>
        <p style={S.subtitle}>
          Distributed Networks — Remote Procedure Call with tRPC + Next.js + Zod
        </p>
      </header>

      {/* ── Topic 1 ── */}
      <TopicHeader n={1} title="tRPC + Apache Thrift Study"
        desc="Architecture study: 5-component RPC model · tRPC internals · Apache Thrift comparison" />
      <TrpcArchitectureCard />
      <ApacheThriftCard />

      {/* ── Topic 2 ── */}
      <TopicHeader n={2} title="Sum Service with tRPC"
        desc="Live demo: remote_sum · remote_divide · error handling · CRUD mutations — all via tRPC" />
      <MathDemo />
      <ErrorDemo />
      <TodoDemo />
      <ServerInfoDemo />

      {/* ── Topic 3 ── */}
      <TopicHeader n={3} title="XML-RPC Sum Service"
        desc="Python implementation — run demos/xmlrpc/server.py then demos/xmlrpc/client.py" />
      <XmlRpcCard />

      {/* ── Topic 4 ── */}
      <TopicHeader n={4} title="JSON-RPC 2.0 Sum Service"
        desc="Live demo — POST /api/jsonrpc (JSON-RPC 2.0 spec) · Python reference in demos/jsonrpc/" />
      <JsonRpcLiveDemo />
    </div>
  );
}

// ─── Topic Header ─────────────────────────────────────────────────────────────
function TopicHeader({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div style={S.topicDivider}>
      <h2 style={S.topicTitle}>
        <span style={{ color: "#60a5fa" }}>Topic {n}:</span>{" "}{title}
      </h2>
      <p style={S.topicDesc}>{desc}</p>
    </div>
  );
}

// ═══════════════════════════════════════════
//  Topic 1a — tRPC Architecture Card
// ═══════════════════════════════════════════
function TrpcArchitectureCard() {
  const info = trpc.math.getServerInfo.useQuery();

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        tRPC Architecture — 5-Component RPC Model
        <span style={S.badge}>live</span>
      </h2>
      <div style={S.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          tRPC maps directly to the classic RPC architecture.
          Each layer is transparent: the client calls procedures as if they were local functions.
        </p>

        {/* 5-component flow */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.4rem", marginBottom: "1rem" }}>
          {[
            { label: "Client Program",  color: "#60a5fa", file: "page.tsx" },
            { label: "Client Stub",     color: "#a78bfa", file: "utils/trpc.ts" },
            { label: "RPC Runtime",     color: "#f59e0b", file: "httpBatchLink" },
            { label: "Server Stub",     color: "#34d399", file: "_app.ts" },
            { label: "Server Program",  color: "#f87171", file: "routers/math.ts" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#0d0d0d", border: `1px solid ${c.color}33`, borderRadius: 8, padding: "0.6rem", textAlign: "center" as const }}>
              <div style={{ color: c.color, fontSize: "0.7rem", fontWeight: 600, marginBottom: "0.2rem" }}>{c.label}</div>
              <div style={{ color: "#444", fontSize: "0.62rem", fontFamily: "monospace" }}>{c.file}</div>
            </div>
          ))}
        </div>

        <p style={S.codeLabel}>tRPC vs gRPC — IDL approach</p>
        <div style={S.code}>{`// gRPC: requires a .proto file + compilation step
// service MathService { rpc RemoteSum(SumRequest) returns (SumReply); }
// protoc --python_out=. service.proto   ← must re-run on every change

// tRPC: TypeScript IS the IDL — zero code generation needed
import type { AppRouter } from "@/server/routers/_app";
const trpc = createTRPCReact<AppRouter>();
// → Full type-safety + autocompletion, no .proto files, no compiler`}</div>

        {info.data && (
          <>
            <p style={S.codeLabel}>Live server info (tRPC query → /api/trpc/math.getServerInfo)</p>
            <div style={S.result}>{JSON.stringify(info.data, null, 2)}</div>
          </>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
//  Topic 1b — Apache Thrift Card
// ═══════════════════════════════════════════
function ApacheThriftCard() {
  const [tab, setTab] = useState<"idl" | "server" | "client">("idl");

  const tabs = {
    idl: {
      label: "sum_service.thrift",
      color: "#fb923c",
      content: `// demos/thrift/sum_service.thrift
// Apache Thrift IDL — "contract" between client and server
// Equivalent to .proto in gRPC, or TypeScript types in tRPC
// Generate stubs: thrift --gen py sum_service.thrift

namespace py sum_service

struct MathRequest {
  1: required double a,
  2: required double b,
}

struct MathResult {
  1: required double result,
  2: required string expression,
  3: required string operation,
}

exception DivisionByZeroException {
  1: required string message,
}

service MathService {
  // remote_sum(a, b) — the course example
  MathResult remoteSum(1: MathRequest request),

  // Typed exception propagated across the network
  MathResult remoteDivide(1: MathRequest request)
    throws (1: DivisionByZeroException divErr),

  MathResult remoteMultiply(1: MathRequest request),
  MathResult remoteSubtract(1: MathRequest request),
  string getServerInfo(),
}`,
    },
    server: {
      label: "server.py",
      color: "#86efac",
      content: `# demos/thrift/server.py — "Server Program"
# Install: pip install thrift
# Generate stubs: thrift --gen py sum_service.thrift
# Run: python server.py

from sum_service import MathService
from sum_service.ttypes import MathResult, DivisionByZeroException

class MathServiceHandler:
    def remoteSum(self, request):
        result = request.a + request.b
        return MathResult(result=result,
                          expression=f"{request.a} + {request.b}",
                          operation="sum")

    def remoteDivide(self, request):
        if request.b == 0:
            raise DivisionByZeroException(message="Division by zero")
        return MathResult(result=request.a / request.b,
                          expression=f"{request.a} / {request.b}",
                          operation="divide")

handler   = MathServiceHandler()
processor = MathService.Processor(handler)
transport = TSocket.TServerSocket(host="localhost", port=9090)
server    = TServer.TSimpleServer(processor, transport, ...)
server.serve()   # Binary protocol over TCP`,
    },
    client: {
      label: "client.py",
      color: "#86efac",
      content: `# demos/thrift/client.py — "Client Program"
# Run (after server.py): python client.py

transport = TSocket.TSocket("localhost", 9090)
transport = TTransport.TBufferedTransport(transport)
protocol  = TBinaryProtocol.TBinaryProtocol(transport)

# Client Stub — generated by Thrift compiler, handles all marshalling
client = MathService.Client(protocol)
transport.open()

# remote_sum(5, 10) — looks LOCAL, executes on the server over TCP
result = client.remoteSum(MathRequest(a=5, b=10))
print(f"{result.expression} = {result.result}")  # 5.0 + 10.0 = 15.0

# Typed exception propagation across TCP (advantage over JSON-RPC)
try:
    client.remoteDivide(MathRequest(a=10, b=0))
except DivisionByZeroException as e:
    print(f"Typed exception: {e.message}")  # ✓ fully typed!`,
    },
  };

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        Apache Thrift — IDL-based Cross-Language RPC
        <span style={{ ...S.badge, background: "#2a1a0a", color: "#fb923c" }}>Python demo</span>
      </h2>
      <div style={S.card}>
        <div style={S.twoCol}>
          {/* Comparison table */}
          <div>
            <p style={{ margin: "0 0 0.5rem", color: "#999", fontSize: "0.82rem", fontWeight: 500 }}>
              Thrift vs tRPC
            </p>
            {[
              ["IDL",       ".thrift file",       "TypeScript types"],
              ["Stubs",     "thrift compiler",    "zero-gen inference"],
              ["Transport", "TCP binary",         "HTTP / JSON"],
              ["Languages", "C++, Java, Python…", "TypeScript only"],
              ["Exceptions","typed, binary",      "TRPCError (JSON)"],
            ].map(([f, t, r]) => (
              <div key={f} style={S.infoRow}>
                <span style={{ color: "#555" }}>{f}</span>
                <span style={{ color: "#fb923c", fontFamily: "monospace", fontSize: "0.75rem" }}>{t}</span>
                <span style={{ color: "#60a5fa", fontFamily: "monospace", fontSize: "0.75rem" }}>{r}</span>
              </div>
            ))}
          </div>
          {/* How to run */}
          <div>
            <p style={{ margin: "0 0 0.5rem", color: "#999", fontSize: "0.82rem", fontWeight: 500 }}>
              How to run (demos/thrift/)
            </p>
            <div style={{ ...S.code, color: "#fb923c", maxHeight: 170, fontSize: "0.73rem" }}>{`# 1. Install Thrift + Python library
pip install thrift

# 2. Generate Python stubs from IDL
thrift --gen py sum_service.thrift

# 3. Terminal 1: start the server (port 9090)
python server.py

# 4. Terminal 2: run the client
python client.py
# → 5.0 + 10.0 = 15.0
# → Typed exception: Division by zero`}</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "1rem", marginBottom: "0.25rem" }}>
          {(["idl", "server", "client"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...S.buttonSm,
                background: tab === t ? "#2a1a0a" : "#161616",
                color: tab === t ? "#fb923c" : "#666",
                border: `1px solid ${tab === t ? "#fb923c44" : "#2a2a2a"}`,
              }}>
              {tabs[t].label}
            </button>
          ))}
        </div>
        <div style={{ ...S.code, color: tabs[tab].color }}>{tabs[tab].content}</div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
//  Topic 2a — remote_sum(a, b)
// ═══════════════════════════════════════════
function MathDemo() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(10);

  // This is the "RPC call" — looks like a local call!
  const sum = trpc.math.remoteSum.useQuery(
    { a, b },
    { enabled: !isNaN(a) && !isNaN(b) }
  );

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        2a. remote_sum(a, b)
        <span style={S.badge}>tRPC query</span>
      </h2>
      <div style={S.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          Example: <code style={S.mono}>result = remote_sum(5, 10)</code>
        </p>
        <div style={S.row}>
          <span style={S.label}>a =</span>
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} style={S.input} />
          <span style={{ color: "#666" }}>+</span>
          <span style={S.label}>b =</span>
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} style={S.input} />
        </div>

        {sum.isLoading && <p style={{ color: "#666", marginTop: "0.75rem" }}>Executing on server...</p>}

        {sum.data && (
          <div style={S.result}>
            <div style={{ color: "#4ade80", marginBottom: "0.5rem" }}>
              {sum.data.expression} = <strong>{sum.data.result}</strong>
            </div>
            <div style={{ color: "#666", fontSize: "0.75rem" }}>
              Request ID: {sum.data.meta.requestId}
              {"\n"}Execution time: {sum.data.meta.executionTime}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
//  Topic 2b — Error handling
// ═══════════════════════════════════════════
function ErrorDemo() {
  const [a, setA] = useState(10);
  const [b, setB] = useState(0);

  const divide = trpc.math.remoteDivide.useQuery(
    { a, b },
    { enabled: false, retry: false }
  );

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        2b. Error handling — remote_divide(a, b)
        <span style={{ ...S.badge, background: "#3a1a1a", color: "#f87171" }}>error demo</span>
      </h2>
      <div style={S.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          "Unlike local calls, RPCs can fail due to Network Timeout or Server Down.
          Your code must handle these exceptions explicitly."
        </p>
        <div style={S.row}>
          <span style={S.label}>a =</span>
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} style={S.input} />
          <span style={{ color: "#666" }}>/</span>
          <span style={S.label}>b =</span>
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} style={S.input} />
          <button onClick={() => divide.refetch()} style={S.button}>Execute RPC</button>
        </div>

        {divide.data && (
          <div style={S.result}>
            <div style={{ color: "#4ade80" }}>
              {divide.data.expression} = <strong>{divide.data.result}</strong>
            </div>
          </div>
        )}

        {divide.error && (
          <div style={S.error}>
            <strong>TRPCError:</strong> {divide.error.message}
            <br />
            <span style={{ fontSize: "0.75rem", color: "#999" }}>
              Code: {divide.error.data?.code} | HTTP: {divide.error.data?.httpStatus}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
//  Topic 2c — Todo CRUD
// ═══════════════════════════════════════════
function TodoDemo() {
  const [newTitle, setNewTitle] = useState("");

  const utils = trpc.useUtils();
  const todos = trpc.todo.list.useQuery();
  const createTodo = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.list.invalidate(); // Refresh list
      setNewTitle("");
    },
  });
  const toggleTodo = trpc.todo.toggleComplete.useMutation({
    onSuccess: () => utils.todo.list.invalidate(),
  });
  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess: () => utils.todo.list.invalidate(),
  });

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        2c. Todo CRUD
        <span style={S.badge}>mutation + query</span>
      </h2>
      <div style={S.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          Demonstrates mutations (create/update/delete), idempotency pattern,
          and cache invalidation.
        </p>

        {/* Create form */}
        <div style={{ ...S.row, marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Add a new todo..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTitle.trim()) {
                createTodo.mutate({ title: newTitle.trim(), clientId: `todo-${Date.now()}` });
              }
            }}
            style={S.inputWide}
          />
          <button
            onClick={() => {
              if (newTitle.trim()) {
                createTodo.mutate({ title: newTitle.trim(), clientId: `todo-${Date.now()}` });
              }
            }}
            style={S.button}
            disabled={createTodo.isPending}
          >
            {createTodo.isPending ? "Creating..." : "Add"}
          </button>
        </div>

        {todos.data?.todos.map((todo) => (
          <div key={todo.id} style={S.todoItem}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo.mutate({ id: todo.id })}
              style={{ cursor: "pointer", accentColor: "#2563eb" }}
            />
            <span style={{ flex: 1, textDecoration: todo.completed ? "line-through" : "none", color: todo.completed ? "#555" : "#eee" }}>
              {todo.title}
            </span>
            <span style={{ color: "#444", fontSize: "0.7rem", fontFamily: "monospace" }}>{todo.id}</span>
            <button onClick={() => deleteTodo.mutate({ id: todo.id })} style={S.buttonDanger}>
              Delete
            </button>
          </div>
        ))}

        {todos.data && (
          <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.75rem" }}>
            Total: {todos.data.total} todos | Queries: list + getById | Mutations: create, toggle, delete
          </p>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
//  Topic 2d — Server Info
// ═══════════════════════════════════════════
function ServerInfoDemo() {
  const info = trpc.math.getServerInfo.useQuery();

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        2d. Server info
        <span style={S.badge}>introspection</span>
      </h2>
      <div style={S.card}>
        {info.data && (
          <div style={{ ...S.result, marginTop: 0 }}>{JSON.stringify(info.data, null, 2)}</div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
//  Topic 3 — XML-RPC Card
// ═══════════════════════════════════════════
function XmlRpcCard() {
  const [tab, setTab] = useState<"server" | "client" | "payload">("server");

  const tabs = {
    server: {
      label: "server.py",
      content: `# demos/xmlrpc/server.py
# No stubs, no .proto files, no compilation — uses Python stdlib only.
# Run: python server.py

from xmlrpc.server import SimpleXMLRPCServer

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

server = SimpleXMLRPCServer(("localhost", 8000), allow_none=True)
server.register_function(remote_sum,      "remote_sum")
server.register_function(remote_divide,   "remote_divide")
server.register_function(remote_multiply, "remote_multiply")
server.register_function(remote_subtract, "remote_subtract")
server.register_introspection_functions()  # system.listMethods()
server.serve_forever()`,
    },
    client: {
      label: "client.py",
      content: `# demos/xmlrpc/client.py
# ServerProxy = Client Stub (dynamic, no code generation needed)
# Run (after server.py): python client.py

import xmlrpc.client

# Connect — ServerProxy intercepts calls and wraps them in XML
proxy = xmlrpc.client.ServerProxy("http://localhost:8000/")

# remote_sum(5, 10) — looks like a local call!
result = proxy.remote_sum(5, 10)
print(f"{result['expression']} = {result['result']}")  # 5.0 + 10.0 = 15.0

result = proxy.remote_divide(22, 7)
print(f"{result['expression']} = {result['result']:.4f}")  # 3.1429

result = proxy.remote_multiply(6, 7)
print(f"{result['expression']} = {result['result']}")  # 6.0 * 7.0 = 42.0

# Error handling
try:
    proxy.remote_divide(10, 0)
except xmlrpc.client.Fault as fault:
    print(f"XML-RPC Fault [{fault.faultCode}]: {fault.faultString}")
    # ✓ Error sent as XML Fault over HTTP!

# Introspection — server self-describes, no IDL file needed on client
methods = proxy.system.listMethods()
print(f"Available: {[m for m in methods if not m.startswith('system.')]}") `,
    },
    payload: {
      label: "XML payload",
      content: `<!-- XML-RPC Request (visible in Wireshark / network tab) -->
<?xml version='1.0'?>
<methodCall>
  <methodName>remote_sum</methodName>
  <params>
    <param><value><double>5.0</double></value></param>
    <param><value><double>10.0</double></value></param>
  </params>
</methodCall>

<!-- XML-RPC Response -->
<?xml version='1.0'?>
<methodResponse>
  <params>
    <param>
      <value>
        <struct>
          <member>
            <name>result</name>
            <value><double>15.0</double></value>
          </member>
          <member>
            <name>expression</name>
            <value><string>5.0 + 10.0</string></value>
          </member>
          <member>
            <name>operation</name>
            <value><string>sum</string></value>
          </member>
        </struct>
      </value>
    </param>
  </params>
</methodResponse>`,
    },
  };

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        3. XML-RPC Sum Service
        <span style={{ ...S.badge, background: "#1a2a0a", color: "#a3e635" }}>Python / HTTP</span>
      </h2>
      <div style={S.card}>
        <div style={S.twoCol}>
          {/* Comparison */}
          <div>
            <p style={{ margin: "0 0 0.4rem", color: "#999", fontSize: "0.82rem", fontWeight: 500 }}>
              XML-RPC vs gRPC
            </p>
            {[
              ["Setup",    "Immediate (no files)",  "Requires .proto + compile"],
              ["Format",   "XML (human-readable)",  "Protobuf (binary)"],
              ["Speed",    "Slow (XML is bulky)",   "Fast (binary)"],
              ["Safety",   "Dynamic (no types)",    "Strict compile-time"],
              ["Stubs",    "Dynamic proxy",         "Generated code"],
              ["Dep.",     "Zero (stdlib)",         "pip install grpcio"],
            ].map(([f, x, g]) => (
              <div key={f} style={S.infoRow}>
                <span style={{ color: "#555", fontSize: "0.77rem" }}>{f}</span>
                <span style={{ color: "#a3e635", fontFamily: "monospace", fontSize: "0.73rem" }}>{x}</span>
                <span style={{ color: "#60a5fa", fontFamily: "monospace", fontSize: "0.73rem" }}>{g}</span>
              </div>
            ))}
          </div>
          {/* How to run */}
          <div>
            <p style={{ margin: "0 0 0.4rem", color: "#999", fontSize: "0.82rem", fontWeight: 500 }}>
              How to run (demos/xmlrpc/)
            </p>
            <div style={{ ...S.code, color: "#a3e635", maxHeight: 175, fontSize: "0.73rem" }}>{`# No dependencies — Python stdlib only!

# Terminal 1: start the server
cd demos/xmlrpc
python server.py
# → XML-RPC Server on http://localhost:8000/

# Terminal 2: run the client
python client.py
# → 5.0 + 10.0 = 15.0
# → 22.0 / 7.0 = 3.1429
# → XML-RPC Fault [1]: Division by zero...`}</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "1rem", marginBottom: "0.25rem" }}>
          {(["server", "client", "payload"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...S.buttonSm,
                background: tab === t ? "#1a2a0a" : "#161616",
                color: tab === t ? "#a3e635" : "#666",
                border: `1px solid ${tab === t ? "#a3e63544" : "#2a2a2a"}`,
              }}>
              {tabs[t].label}
            </button>
          ))}
        </div>
        <div style={{ ...S.code, color: tab === "payload" ? "#fb923c" : "#86efac" }}>
          {tabs[tab].content}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
//  Topic 4 — JSON-RPC 2.0 Live Demo
// ═══════════════════════════════════════════
type RpcResponse = {
  jsonrpc: "2.0";
  result?: { result: number; expression: string; operation: string };
  error?: { code: number; message: string };
  id: number | string | null;
};

function JsonRpcLiveDemo() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(10);
  const [method, setMethod] = useState("math.sum");
  const [loading, setLoading] = useState(false);
  const [reqPayload, setReqPayload] = useState<string | null>(null);
  const [response, setResponse] = useState<RpcResponse | RpcResponse[] | null>(null);
  const [rpcError, setRpcError] = useState<string | null>(null);

  const call = async (body: object) => {
    setReqPayload(JSON.stringify(body, null, 2));
    setLoading(true);
    setResponse(null);
    setRpcError(null);
    try {
      const res = await fetch("/api/jsonrpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResponse(data);
      if (!Array.isArray(data) && data.error) setRpcError(data.error.message);
    } catch (e: unknown) {
      setRpcError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const callSingle = () =>
    call({ jsonrpc: "2.0", method, params: [a, b], id: Date.now() });

  const callBatch = () =>
    call([
      { jsonrpc: "2.0", method: "math.sum",      params: [a, b], id: 1 },
      { jsonrpc: "2.0", method: "math.multiply",  params: [a, b], id: 2 },
      { jsonrpc: "2.0", method: "math.subtract",  params: [a, b], id: 3 },
    ]);

  return (
    <section style={S.section}>
      <h2 style={S.sectionTitle}>
        4. JSON-RPC 2.0 — Live Demo
        <span style={{ ...S.badge, background: "#0a1a2a", color: "#38bdf8" }}>POST /api/jsonrpc</span>
      </h2>
      <div style={S.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          Calls <code style={{ ...S.mono, color: "#38bdf8" }}>/api/jsonrpc</code> directly — no tRPC, raw JSON-RPC 2.0.
          The <code style={S.mono}>id</code> field links each response to its request (critical for batch/async).
        </p>

        <div style={S.row}>
          <span style={S.label}>method:</span>
          <select value={method} onChange={(e) => setMethod(e.target.value)} style={S.select}>
            <option value="math.sum">math.sum</option>
            <option value="math.divide">math.divide</option>
            <option value="math.multiply">math.multiply</option>
            <option value="math.subtract">math.subtract</option>
            <option value="math.modulo">math.modulo (not found)</option>
          </select>
          <span style={S.label}>a =</span>
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} style={S.input} />
          <span style={S.label}>b =</span>
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} style={S.input} />
          <button onClick={callSingle} style={S.button} disabled={loading}>
            {loading ? "Calling…" : "Execute"}
          </button>
          <button
            onClick={callBatch}
            style={{ ...S.buttonSm, background: "#0a1a2a", color: "#38bdf8", border: "1px solid #1e3a5f" }}
            disabled={loading}
          >
            Batch (sum + multiply + subtract)
          </button>
        </div>

        {reqPayload && (
          <>
            <p style={S.codeLabel}>Request payload sent to /api/jsonrpc</p>
            <div style={{ ...S.codeBlue, color: "#38bdf8" }}>{reqPayload}</div>
          </>
        )}

        {response && !rpcError && (
          <>
            <p style={S.codeLabel}>Response</p>
            <div style={S.result}>{JSON.stringify(response, null, 2)}</div>
          </>
        )}

        {rpcError && (
          <div style={S.error}>
            <strong>JSON-RPC Error:</strong> {rpcError}
            {!Array.isArray(response) && response?.error && (
              <span style={{ color: "#999", fontSize: "0.8rem", marginLeft: "0.5rem" }}>
                (code: {response.error.code})
              </span>
            )}
            {!Array.isArray(response) && response && (
              <>
                <p style={S.codeLabel}>Raw response</p>
                <div style={S.result}>{JSON.stringify(response, null, 2)}</div>
              </>
            )}
          </div>
        )}

        {/* Comparison table */}
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #1a1a1a", paddingTop: "1rem" }}>
          <div style={S.twoCol}>
            <div>
              <p style={{ ...S.codeLabel, marginTop: 0 }}>JSON-RPC 2.0 vs tRPC</p>
              {[
                ["Protocol",  "Raw JSON-RPC 2.0",   "tRPC (wrapper)"],
                ["Type safety","Runtime only",       "Compile-time (TS)"],
                ["Client",    "Manual fetch()",      "Auto-generated stub"],
                ["Batching",  "Spec-native array",  "httpBatchLink"],
                ["Errors",    "code + message",      "TRPCError + HTTP"],
                ["Setup",     "No compilation",      "No compilation"],
              ].map(([f, j, t]) => (
                <div key={f} style={S.infoRow}>
                  <span style={{ color: "#555", fontSize: "0.77rem" }}>{f}</span>
                  <span style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "0.73rem" }}>{j}</span>
                  <span style={{ color: "#a78bfa", fontFamily: "monospace", fontSize: "0.73rem" }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ ...S.codeBlue, color: "#38bdf8", maxHeight: 160, fontSize: "0.72rem", marginTop: 0 }}>{`// JSON-RPC 2.0 spec — request structure
{ "jsonrpc": "2.0",
  "method":  "math.sum",
  "params":  [5, 10],
  "id":      1 }   // ← links response to request

// Success response
{ "jsonrpc": "2.0", "result": {...}, "id": 1 }

// Error response
{ "jsonrpc": "2.0",
  "error": { "code": -32601, "message": "..." },
  "id": 1 }

// Batch: array → array
[{...id:1}, {...id:2}] → [{...id:1}, {...id:2}]`}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
