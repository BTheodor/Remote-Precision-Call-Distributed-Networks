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

// ─── Styles ───
const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: "2rem" },
  header: { borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "2rem" },
  h1: { fontSize: "1.8rem", margin: 0, fontWeight: 600 },
  subtitle: { color: "#888", marginTop: "0.5rem", fontSize: "0.9rem" },
  section: { marginBottom: "2.5rem" },
  sectionTitle: { fontSize: "1.2rem", marginBottom: "1rem", color: "#60a5fa", fontWeight: 500 },
  card: { background: "#161616", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" },
  input: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "0.5rem 0.75rem", color: "#eee", fontSize: "1rem", width: 80 } as React.CSSProperties,
  inputWide: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "0.5rem 0.75rem", color: "#eee", fontSize: "1rem", flex: 1 } as React.CSSProperties,
  button: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 },
  buttonSmall: { background: "#333", color: "#ccc", border: "none", borderRadius: 6, padding: "0.3rem 0.8rem", cursor: "pointer", fontSize: "0.8rem" },
  buttonDanger: { background: "#7f1d1d", color: "#fca5a5", border: "none", borderRadius: 6, padding: "0.3rem 0.8rem", cursor: "pointer", fontSize: "0.8rem" },
  result: { background: "#0d1f0d", border: "1px solid #1a3a1a", borderRadius: 8, padding: "1rem", fontFamily: "monospace", fontSize: "0.85rem", marginTop: "1rem", whiteSpace: "pre-wrap" as const },
  error: { background: "#1f0d0d", border: "1px solid #3a1a1a", borderRadius: 8, padding: "1rem", color: "#f87171", marginTop: "1rem", fontSize: "0.85rem" },
  badge: { display: "inline-block", background: "#1e3a5f", color: "#93c5fd", borderRadius: 4, padding: "0.15rem 0.5rem", fontSize: "0.75rem", marginLeft: "0.5rem" },
  row: { display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" as const },
  todoItem: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderBottom: "1px solid #222" },
  label: { color: "#888", fontSize: "0.85rem" },
  mono: { fontFamily: "monospace", color: "#a78bfa" },
};

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>
          RPC Implementation
          <span style={{ ...styles.badge, background: "#1a2e1a", color: "#86efac" }}>tRPC v11</span>
        </h1>
        <p style={styles.subtitle}>
          Distributed Networks — Remote Procedure Call with tRPC + Next.js + Zod
        </p>
      </header>

      <MathDemo />
      <ErrorDemo />
      <TodoDemo />
      <ServerInfoDemo />
    </div>
  );
}

// ═══════════════════════════════════════════
//  1. Math Demo — remote_sum(5, 10)
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
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        1. remote_sum(a, b)
        <span style={styles.badge}>query</span>
      </h2>
      <div style={styles.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          Example: <code style={styles.mono}>result = remote_sum(5, 10)</code>
        </p>
        <div style={styles.row}>
          <span style={styles.label}>a =</span>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            style={styles.input}
          />
          <span style={{ color: "#666" }}>+</span>
          <span style={styles.label}>b =</span>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        {sum.isLoading && <p style={{ color: "#666" }}>Executing on server...</p>}

        {sum.data && (
          <div style={styles.result}>
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
//  2. Error Handling Demo
// ═══════════════════════════════════════════
function ErrorDemo() {
  const [a, setA] = useState(10);
  const [b, setB] = useState(0);

  const divide = trpc.math.remoteDivide.useQuery(
    { a, b },
    { enabled: false, retry: false }
  );

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        2. Error handling — remote_divide(a, b)
        <span style={{ ...styles.badge, background: "#3a1a1a", color: "#f87171" }}>error demo</span>
      </h2>
      <div style={styles.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          "RPCs can fail due to Network Timeout or Server Down.
          Your code must handle these exceptions explicitly."
        </p>
        <div style={styles.row}>
          <span style={styles.label}>a =</span>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            style={styles.input}
          />
          <span style={{ color: "#666" }}>/</span>
          <span style={styles.label}>b =</span>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            style={styles.input}
          />
          <button
            onClick={() => divide.refetch()}
            style={styles.button}
          >
            Execute RPC
          </button>
        </div>

        {divide.data && (
          <div style={styles.result}>
            <div style={{ color: "#4ade80" }}>
              {divide.data.expression} = <strong>{divide.data.result}</strong>
            </div>
          </div>
        )}

        {divide.error && (
          <div style={styles.error}>
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
//  3. Todo CRUD Demo
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
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        3. Todo CRUD
        <span style={styles.badge}>mutation + query</span>
      </h2>
      <div style={styles.card}>
        <p style={{ margin: "0 0 1rem", color: "#999", fontSize: "0.85rem" }}>
          Demonstrates mutations (create/update/delete), idempotency pattern,
          and cache invalidation.
        </p>

        {/* Create form */}
        <div style={{ ...styles.row, marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Add a new todo..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTitle.trim()) {
                createTodo.mutate({
                  title: newTitle.trim(),
                  clientId: `todo-${Date.now()}`, // Idempotency key!
                });
              }
            }}
            style={styles.inputWide}
          />
          <button
            onClick={() => {
              if (newTitle.trim()) {
                createTodo.mutate({
                  title: newTitle.trim(),
                  clientId: `todo-${Date.now()}`,
                });
              }
            }}
            style={styles.button}
            disabled={createTodo.isPending}
          >
            {createTodo.isPending ? "Creating..." : "Add"}
          </button>
        </div>

        {/* Todo list */}
        {todos.data?.todos.map((todo) => (
          <div key={todo.id} style={styles.todoItem}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo.mutate({ id: todo.id })}
              style={{ cursor: "pointer", accentColor: "#2563eb" }}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#555" : "#eee",
              }}
            >
              {todo.title}
            </span>
            <span style={{ color: "#444", fontSize: "0.7rem", fontFamily: "monospace" }}>
              {todo.id}
            </span>
            <button
              onClick={() => deleteTodo.mutate({ id: todo.id })}
              style={styles.buttonDanger}
            >
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
//  4. Server Info
// ═══════════════════════════════════════════
function ServerInfoDemo() {
  const info = trpc.math.getServerInfo.useQuery();

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        4. Server info
        <span style={styles.badge}>introspection</span>
      </h2>
      <div style={styles.card}>
        {info.data && (
          <div style={{ ...styles.result, marginTop: 0 }}>
            {JSON.stringify(info.data, null, 2)}
          </div>
        )}
      </div>
    </section>
  );
}
