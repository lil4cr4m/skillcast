import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logError } from "./utils/logger.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import castRoutes from "./routes/castRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Import our database query helper
import { query } from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure refresh_tokens table exists (prevents login 500s on fresh DB)
const ensureRefreshTokensTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        token TEXT PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  } catch (err) {
    logError("ensureRefreshTokensTable", err);
  }
};

// ==========================================
// MIDDLEWARE
// ==========================================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json()); // Parse incoming JSON requests

// Kick off DB table guard (non-blocking)
ensureRefreshTokensTable();

// ==========================================
// HEALTH CHECK & ERROR HANDLING
// ==========================================
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "active", timestamp: new Date() });
});

// ==========================================
// ROUTE HANDLERS
// ==========================================
app.use("/api/auth", authRoutes); // Registration, Login, Refresh
app.use("/api/users", userRoutes); // Profiles & Leaderboards
app.use("/api/casts", castRoutes); // Live Casts
app.use("/api/skills", skillRoutes); // Skill Catalog
app.use("/api/notes", noteRoutes); // Gratitude & Karma

// ==========================================
// FALLBACKS & ERROR HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  logError("app", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
app.listen(PORT, () => {});

export default app;
