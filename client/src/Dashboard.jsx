import { useState } from "react";

const API_BASE = "https://futuresync-ai.onrender.com/api";

export default function Dashboard({ user, onLogout }) {
  const [name, setName] = useState(user?.name || "");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const handleUpdate = async () => {
    setStatus("updating");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setStatus("success");
        setMessage("✅ Profile updated successfully!");
      } else {
        setStatus("error");
        setMessage("❌ " + data.error);
      }
    } catch {
      setStatus("error");
      setMessage("❌ Cannot connect to server");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        onLogout();
      }
    } catch {
      setMessage("❌ Cannot connect to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome, {user?.name}! 🎉</h1>
        <p style={styles.email}>📧 {user?.email}</p>

        {/* Status Info */}
        <div style={styles.infoBox}>
          <p style={styles.infoText}>✅ You are successfully logged in!</p>
          <p style={styles.infoText}>🔐 JWT Authentication is working</p>
          <p style={styles.infoText}>🗄️ MongoDB is storing your data</p>
          <p style={styles.infoText}>🚀 Full Stack MERN app is complete!</p>
        </div>

        {/* UPDATE Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>✏️ Update Profile</h3>
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />
          <button
            style={styles.updateBtn}
            onClick={handleUpdate}
            disabled={status === "updating"}
          >
            {status === "updating" ? "Updating..." : "Update Name"}
          </button>
          {message && <p style={styles.msg}>{message}</p>}
        </div>

        {/* DELETE Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🗑️ Delete Account</h3>
          {!showDelete ? (
            <button style={styles.deleteBtn} onClick={() => setShowDelete(true)}>
              Delete My Account
            </button>
          ) : (
            <div>
              <p style={styles.warning}>⚠️ Are you sure? This cannot be undone!</p>
              <div style={styles.confirmRow}>
                <button style={styles.confirmBtn} onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button style={styles.cancelBtn} onClick={() => setShowDelete(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={styles.buttons}>
          <a href="/" style={styles.homeBtn}>← Back to Home</a>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", padding: "2rem" },
  card: { background: "white", padding: "2.5rem", borderRadius: "16px", width: "100%", maxWidth: "500px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" },
  title: { fontFamily: "sans-serif", fontSize: "1.8rem", fontWeight: "800", color: "#1a1a2e", marginBottom: "0.5rem", textAlign: "center" },
  email: { color: "#808080", marginBottom: "1.5rem", fontFamily: "sans-serif", textAlign: "center" },
  infoBox: { background: "#f0fdf4", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" },
  infoText: { fontFamily: "sans-serif", fontSize: "0.9rem", color: "#166534", marginBottom: "0.5rem" },
  section: { background: "#f9fafb", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" },
  sectionTitle: { fontFamily: "sans-serif", fontSize: "1rem", fontWeight: "700", color: "#1a1a2e", marginBottom: "0.75rem" },
  input: { width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e5e5e5", fontSize: "0.95rem", fontFamily: "sans-serif", boxSizing: "border-box", marginBottom: "0.5rem", outline: "none" },
  updateBtn: { background: "#6366f1", color: "white", border: "none", borderRadius: "8px", padding: "0.6rem 1.2rem", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", fontSize: "0.9rem" },
  deleteBtn: { background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "0.6rem 1.2rem", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", fontSize: "0.9rem" },
  warning: { color: "#dc2626", fontSize: "0.85rem", fontFamily: "sans-serif", marginBottom: "0.5rem" },
  confirmRow: { display: "flex", gap: "0.5rem" },
  confirmBtn: { background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" },
  cancelBtn: { background: "#e5e5e5", color: "#333", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" },
  msg: { fontSize: "0.85rem", fontFamily: "sans-serif", marginTop: "0.5rem", color: "#166534" },
  buttons: { display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" },
  homeBtn: { padding: "0.75rem 1.5rem", background: "#6366f1", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontFamily: "sans-serif" },
  logoutBtn: { padding: "0.75rem 1.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" },
};