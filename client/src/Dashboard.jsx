export default function Dashboard({ user, onLogout }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome, {user?.name}! 🎉</h1>
        <p style={styles.email}>📧 {user?.email}</p>
        <div style={styles.infoBox}>
          <p style={styles.infoText}>✅ You are successfully logged in!</p>
          <p style={styles.infoText}>🔐 JWT Authentication is working</p>
          <p style={styles.infoText}>🗄️ MongoDB is storing your data</p>
          <p style={styles.infoText}>🚀 Full Stack MERN app is complete!</p>
        </div>
        <div style={styles.buttons}>
          <a href="/" style={styles.homeBtn}>← Back to Home</a>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  card: { background: "white", padding: "2.5rem", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", textAlign: "center" },
  title: { fontFamily: "sans-serif", fontSize: "1.8rem", fontWeight: "800", color: "#1a1a2e", marginBottom: "0.5rem" },
  email: { color: "#808080", marginBottom: "1.5rem", fontFamily: "sans-serif" },
  infoBox: { background: "#f0fdf4", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem", textAlign: "left" },
  infoText: { fontFamily: "sans-serif", fontSize: "0.9rem", color: "#166534", marginBottom: "0.5rem" },
  buttons: { display: "flex", gap: "1rem", justifyContent: "center" },
  homeBtn: { padding: "0.75rem 1.5rem", background: "#6366f1", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontFamily: "sans-serif" },
  logoutBtn: { padding: "0.75rem 1.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" },
};