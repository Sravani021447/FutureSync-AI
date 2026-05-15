import { useState, useEffect } from "react";

// ============================================================
// MOCK DATA (only for companies — rest comes from database)
// ============================================================
const mockDB = {
  companies: [
    { id: 1, name: "Foxconn", icon: "🏗️" },
    { id: 2, name: "Pegatron", icon: "⚙️" },
    { id: 3, name: "LuxshareICT", icon: "🔌" },
    { id: 4, name: "Tata Group", icon: "🌐" },
  ],
};

// ============================================================
// REAL API — connects to your Express + MongoDB backend
// ============================================================
const API_BASE = "https://futuresync-ai.onrender.com/api";

const api = {
  getTestimonials: () => fetch(`${API_BASE}/testimonials`).then(r => r.json()),
  getFeatures: () => fetch(`${API_BASE}/features`).then(r => r.json()),
  subscribeNewsletter: (email) =>
    fetch(`${API_BASE}/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(r => r.json()),
};

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root { --primary: #6366f1; --accent: #3f83f8; --text: #1a1a2e; --gray: #808080; --light-gray: #f0f0f0; --white: #ffffff; --dark-gray: #555; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--text); }
  .navbar { position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; z-index: 1000; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid #e5e5e5; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; max-width: 1280px; }
  .navbar-logo { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--text); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
  .navbar-logo span { color: var(--primary); }
  .navbar-links { display: flex; gap: 2rem; list-style: none; }
  .navbar-links a { color: #718096; font-weight: 500; font-size: 0.95rem; text-decoration: none; transition: color 0.2s; }
  .navbar-links a:hover { color: var(--primary); }
  .btn-primary { background: var(--primary); color: white; border: none; border-radius: 8px; padding: 0.6rem 1.4rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-primary:hover { background: #5254f8; transform: translateY(-1px); }
  .btn-secondary { background: var(--dark-gray); color: white; border: none; border-radius: 8px; padding: 0.6rem 1.4rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-secondary:hover { background: var(--gray); }
  .hero { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 3rem; padding: 7rem 4rem 4rem; min-height: 100vh; }
  .hero-left { flex: 1; text-align: left; }
  .hero-label { font-size: 0.85rem; font-weight: 700; color: var(--primary); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; background: #eef2ff; display: inline-block; padding: 0.35rem 0.85rem; border-radius: 999px; }
  .hero-title { font-family: 'Syne', sans-serif; font-size: 3.4rem; font-weight: 800; line-height: 1.1; color: var(--text); margin-bottom: 1.5rem; }
  .hero-title span { color: var(--primary); }
  .hero-desc { color: var(--gray); font-size: 1.05rem; line-height: 1.7; max-width: 480px; margin-bottom: 2rem; }
  .hero-buttons { display: flex; gap: 1rem; }
  .hero-right { flex: 1; display: flex; justify-content: center; }
  .hero-image-box { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 24px; width: 300px; height: 520px; display: flex; align-items: center; justify-content: center; box-shadow: 0 25px 60px rgba(99,102,241,0.35); font-size: 7rem; animation: float 3s ease-in-out infinite; overflow: hidden; }
  .hero-image-box img { width: 100%; height: 100%; object-fit: cover; }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
  .companies { background: var(--light-gray); padding: 3rem 2rem; text-align: center; }
  .companies h2 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--gray); margin-bottom: 2rem; letter-spacing: 0.05em; text-transform: uppercase; }
  .companies-grid { display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap; }
  .company-chip { display: flex; align-items: center; gap: 0.5rem; background: white; border-radius: 999px; padding: 0.5rem 1.2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.07); font-weight: 600; color: var(--dark-gray); font-size: 0.9rem; }
  .features-section { background: var(--light-gray); padding: 5rem 2rem; text-align: center; }
  .section-header { max-width: 640px; margin: 0 auto 3rem; }
  .section-header h2 { font-family: 'Syne', sans-serif; font-size: 2.4rem; font-weight: 800; margin-bottom: 1rem; }
  .section-header p { color: var(--gray); font-size: 1rem; line-height: 1.7; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; max-width: 960px; margin: 0 auto; }
  .feature-card { border-radius: 16px; padding: 1.8rem; text-align: left; transition: transform 0.2s; cursor: default; }
  .feature-card:hover { transform: translateY(-4px); }
  .feature-icon { background: rgba(255,255,255,0.3); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1rem; }
  .feature-card h3 { color: white; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem; }
  .feature-card p { color: rgba(255,255,255,0.85); font-size: 0.9rem; line-height: 1.6; }
  .testimonials-section { padding: 5rem 2rem; max-width: 1280px; margin: 0 auto; }
  .testimonials-section h2 { font-family: 'Syne', sans-serif; font-size: 2.4rem; font-weight: 800; margin-bottom: 2.5rem; text-align: center; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.5rem; }
  .testimonial-card { border: 1px solid #e5e5e5; border-radius: 16px; padding: 1.5rem; transition: all 0.3s; background: white; }
  .testimonial-card:hover { border-color: var(--primary); box-shadow: 0 8px 24px rgba(99,102,241,0.12); transform: translateY(-4px); }
  .t-quote { font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem; }
  .t-text { color: #555; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.2rem; }
  .t-avatar-row { display: flex; align-items: center; gap: 0.8rem; }
  .t-avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }
  .t-name { font-weight: 700; font-size: 0.95rem; }
  .t-role { color: var(--gray); font-size: 0.8rem; }
  .newsletter-section { padding: 2rem; max-width: 1280px; margin: 0 auto; }
  .newsletter-box { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 20px; padding: 3rem; display: flex; align-items: center; gap: 3rem; flex-wrap: wrap; }
  .newsletter-left { font-size: 4rem; }
  .newsletter-right { flex: 1; color: white; min-width: 260px; }
  .newsletter-right h2 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
  .newsletter-right p { opacity: 0.85; margin-bottom: 1.2rem; }
  .newsletter-form { display: flex; gap: 0.7rem; flex-wrap: wrap; }
  .newsletter-input { flex: 1; min-width: 200px; padding: 0.7rem 1rem; border-radius: 8px; border: 2px solid transparent; outline: none; font-size: 0.95rem; font-family: 'DM Sans', sans-serif; transition: border 0.2s; }
  .newsletter-input:focus { border-color: #c4b5fd; }
  .newsletter-btn { background: white; color: var(--primary); border: none; border-radius: 8px; padding: 0.7rem 1.4rem; font-weight: 700; cursor: pointer; font-size: 0.95rem; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .newsletter-btn:hover { background: #f0f0f0; }
  .newsletter-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .privacy { font-size: 0.75rem; opacity: 0.7; margin-top: 0.8rem; }
  .privacy a { color: white; text-decoration: underline; }
  .success-msg { color: #86efac; font-weight: 600; margin-top: 0.5rem; }
  .error-msg { color: #fca5a5; font-weight: 600; margin-top: 0.5rem; }
  .footer { background: #fafafa; border-top: 1px solid #e5e5e5; padding: 3rem 2rem 0; }
  .footer-inner { max-width: 1280px; margin: 0 auto; display: flex; gap: 4rem; flex-wrap: wrap; align-items: flex-start; }
  .footer-brand { flex: 1; min-width: 200px; }
  .footer-logo { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: var(--text); margin-bottom: 0.5rem; }
  .footer-logo span { color: var(--primary); }
  .footer-tagline { color: var(--gray); font-size: 0.85rem; margin-bottom: 1rem; }
  .footer-socials { display: flex; gap: 0.7rem; }
  .social-btn { width: 36px; height: 36px; border-radius: 8px; background: var(--light-gray); display: flex; align-items: center; justify-content: center; font-size: 1rem; cursor: pointer; transition: background 0.2s; text-decoration: none; color: var(--text); }
  .social-btn:hover { background: #d1d5db; }
  .footer-links { display: flex; gap: 4rem; flex-wrap: wrap; flex: 2; }
  .footer-col h4 { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; margin-bottom: 1rem; color: var(--text); }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .footer-col ul li a { color: var(--gray); font-size: 0.85rem; text-decoration: none; transition: color 0.2s; }
  .footer-col ul li a:hover { color: var(--primary); }
  .footer-bottom { text-align: center; padding: 1.5rem; color: var(--gray); font-size: 0.8rem; border-top: 1px solid #e5e5e5; margin-top: 2.5rem; }
  .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 768px) {
    .hero { flex-direction: column; padding: 6rem 1.5rem 3rem; text-align: center; }
    .hero-left { text-align: center; }
    .hero-desc { margin: 0 auto 2rem; }
    .hero-buttons { justify-content: center; }
    .hero-title { font-size: 2.2rem; }
    .navbar-links { display: none; }
    .footer-inner { flex-direction: column; }
    .footer-links { gap: 2rem; }
    .newsletter-box { padding: 2rem; }
  }
`;

// ============================================================
// COMPONENTS
// ============================================================

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none" }}>
      <div className="navbar-logo">Future<span>Sync</span> AI</div>
      <ul className="navbar-links">
        {["Home","Features","Pricing","Blog","About"].map((item) => (
          <li key={item}><a href={`#${item.toLowerCase()}`}>{item}</a></li>
        ))}
      </ul>
      <button className="btn-primary">Contact Us</button>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <p className="hero-label">✨ Proudly Introducing Next-Gen Learning</p>
        <h1 className="hero-title">Seamless Learning at <span>iPhone-level</span> Speed</h1>
        <p className="hero-desc">Our advanced AI-powered platform delivers a seamless and intelligent experience designed for the future. Built with next-generation mobile technology, it helps students stay productive, organized, and ahead in their academic journey.</p>
        <div className="hero-buttons">
          <button className="btn-primary">Start Now</button>
          <button className="btn-secondary">Take Tour</button>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-image-box">
          <img src="/iphone.jpeg" alt="iPhone" onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='📱'; }} />
        </div>
      </div>
    </section>
  );
}

function Companies({ companies }) {
  return (
    <section className="companies">
      <h2>Trusted by the Best</h2>
      <div className="companies-grid">
        {companies.map((c) => (
          <div key={c.id} className="company-chip">
            <span>{c.icon}</span><span>{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features({ features, loading }) {
  return (
    <section className="features-section" id="features">
      <div className="section-header">
        <h2>Our Next-Generation Advantage</h2>
        <p>Our platform combines advanced mobile intelligence, AI automation, and seamless cloud synchronization to deliver a premium learning experience built for the future.</p>
      </div>
      <div className="features-grid">
        {loading
          ? [1,2,3,4,5,6].map((i) => <div key={i} className="feature-card" style={{background:"#ddd",height:180,opacity:0.4}} />)
          : features.map((f) => (
              <div key={f._id} className="feature-card" style={{background:f.color}}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
      </div>
    </section>
  );
}

function Testimonials({ testimonials, loading }) {
  return (
    <section className="testimonials-section">
      <h2>What Others Say About Us</h2>
      <div className="testimonials-grid">
        {loading
          ? [1,2,3].map((i) => <div key={i} className="testimonial-card" style={{height:200,opacity:0.4,background:"#f0f0f0"}} />)
          : testimonials.map((t) => (
              <div key={t._id} className="testimonial-card">
                <div className="t-quote">"</div>
                <p className="t-text">{t.text}</p>
                <div className="t-avatar-row">
                  <div className="t-avatar" style={{background:t.color}}>{t.avatar}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      // REAL API CALL to backend
      const res = await api.subscribeNewsletter(email);
      if (res.success) {
        setStatus("success");
        setMessage(`🎉 ${email} subscribed successfully!`);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(res.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Cannot connect to server. Try again.");
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-box">
        <div className="newsletter-left">📬</div>
        <div className="newsletter-right">
          <h2>Get the Latest Updates</h2>
          <p>Sign up for our newsletter and stay ahead.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input className="newsletter-input" type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }} />
            <button className="newsletter-btn" type="submit" disabled={status === "loading"}>
              {status === "loading" ? <span className="spinner" /> : "Subscribe"}
            </button>
          </form>
          {status === "success" && <p className="success-msg">{message}</p>}
          {status === "error" && <p className="error-msg">{message}</p>}
          <p className="privacy">By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerCols = [
    { heading: "Products", links: ["iPhone 17","iPhone 17 Pro","iPhone 17 Pro Max","Compare Models","Accessories"] },
    { heading: "Company", links: ["About Apple","Newsroom","Careers","Investors","Events"] },
    { heading: "Support", links: ["Support Center","Contact Us","Warranty","Order Status","FAQ"] },
    { heading: "Legal", links: ["Terms of Service","Privacy Policy","Cookie Policy"] },
  ];
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">Future<span>Sync</span> AI</div>
          <p className="footer-tagline">Seamless learning of next generation AI</p>
          <div className="footer-socials">
            {["📸","💼","🐦","🐙"].map((icon, i) => <a key={i} className="social-btn" href="#">{icon}</a>)}
          </div>
        </div>
        <div className="footer-links">
          {footerCols.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>{col.links.map((link) => <li key={link}><a href="#">{link}</a></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">© 2026–Present FutureSync AI · All rights reserved.</div>
    </footer>
  );
}

// ============================================================
// MAIN APP — fetches REAL data from MongoDB via Express
// ============================================================
export default function App() {
  const [data, setData] = useState({ testimonials: [], features: [], companies: mockDB.companies });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonials, features] = await Promise.all([
          api.getTestimonials(),
          api.getFeatures(),
        ]);
        setData({
          testimonials,
          features,
          companies: mockDB.companies,
        });
      } catch (err) {
        console.error("Failed to fetch from database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <Hero />
      <Companies companies={data.companies} />
      <Features features={data.features} loading={loading} />
      <Testimonials testimonials={data.testimonials} loading={loading} />
      <Newsletter />
      <Footer />
    </>
  );
}