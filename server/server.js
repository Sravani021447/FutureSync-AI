require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://future-sync-ai.vercel.app"
  ]
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── SCHEMAS ──────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  subscribedAt: { type: Date, default: Date.now },
});
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

const testimonialSchema = new mongoose.Schema({
  name: String, role: String, text: String, avatar: String, color: String,
});
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

const featureSchema = new mongoose.Schema({
  icon: String, title: String, description: String, color: String,
  order: { type: Number, default: 0 },
});
const Feature = mongoose.model("Feature", featureSchema);

// ── MIDDLEWARE ────────────────────────────────────────────────

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "futuresync_secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ── AUTH ROUTES ───────────────────────────────────────────────

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "All fields required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "futuresync_secret",
      { expiresIn: "7d" }
    );
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "All fields required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "futuresync_secret",
      { expiresIn: "7d" }
    );
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET PROFILE (protected)
app.get("/api/auth/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── OTHER ROUTES ──────────────────────────────────────────────

app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

app.get("/api/features", async (req, res) => {
  try {
    const features = await Feature.find().sort({ order: 1 });
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch features" });
  }
});

app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "Invalid email" });
  }
  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: "Already subscribed" });
    }
    await Subscriber.create({ email });
    res.json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/api/seed", async (req, res) => {
  try {
    await Testimonial.deleteMany({});
    await Feature.deleteMany({});
    await Testimonial.insertMany([
      { name: "Tim Cook", role: "CEO of Apple Inc", text: "Regularly emphasizes iPhone performance improvements during launch events.", avatar: "TC", color: "#6366f1" },
      { name: "Ming-Chi Kuo", role: "Apple Industry Analyst", text: "Often reports on Apple chip advancements and performance improvements.", avatar: "MK", color: "#3b82f6" },
      { name: "Marques Brownlee", role: "Global Trusted Tech Reviewer", text: "Top tech reviewers consistently rank iPhone performance among the best.", avatar: "MB", color: "#8b5cf6" },
    ]);
    await Feature.insertMany([
      { icon: "🧠", title: "Personalized Intelligence", description: "AI-driven insights that adapt to individual study patterns.", color: "#44e2ae", order: 1 },
      { icon: "💰", title: "Smart Affordability", description: "Premium learning tools at an optimized cost.", color: "#ed922a", order: 2 },
      { icon: "🏭", title: "Industry Connected Learning", description: "Bridge academic learning with real-world applications.", color: "#d0df24", order: 3 },
      { icon: "📱", title: "Intelligent Mobile Technology", description: "Built using modern mobile frameworks and AI automation.", color: "#e14dde", order: 4 },
      { icon: "🤖", title: "Intelligent Support System", description: "Instant help through AI chat assistance and smart FAQs.", color: "#56db44", order: 5 },
      { icon: "📊", title: "Performance Insights & Analytics", description: "Track learning progress and receive data-driven suggestions.", color: "#d12d2d", order: 6 },
    ]);
    res.json({ success: true, message: "Database seeded!" });
  } catch (err) {
    res.status(500).json({ error: "Seed failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));