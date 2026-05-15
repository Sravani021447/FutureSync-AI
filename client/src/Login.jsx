import { useState } from "react";

const API_BASE = "https://futuresync-ai.onrender.com/api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error);
        setStatus("idle");
      }
    } catch {
      setError("Cannot connect to server");
      setStatus("idle");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to FutureSync AI</p>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email address"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account?{" "}
          <a href="/register" style={styles.a}>Register here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" },
  card: { background: "white", padding: "2.5rem", borderRadius: "16px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" },
  title: { fontFamily: "sans-serif", fontSize: "1.8rem", fontWeight: "800", color: "#1a1a2e", marginBottom: "0.5rem" },
  subtitle: { color: "#808080", marginBottom: "1.5rem", fontFamily: "sans-serif" },
  input: { width: "100%", padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #e5e5e5", fontSize: "1rem", fontFamily: "sans-serif", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", padding: "0.75rem", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" },
  error: { color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.5rem", fontFamily: "sans-serif" },
  link: { textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", fontFamily: "sans-serif", color: "#555" },
  a: { color: "#6366f1", fontWeight: "700" },
};