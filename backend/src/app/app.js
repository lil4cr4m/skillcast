/**
 * SKILLCAST BACKEND SERVER
 * Express.js application with feature-based architecture
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logError } from "../shared/utils/logger.js";

// Import feature-based routes from each domain
import authRoutes from "../features/auth/routes/authRoutes.js";
import castRoutes from "../features/casts/routes/castRoutes.js";
import skillRoutes from "../features/skills/routes/skillRoutes.js";
import noteRoutes from "../features/notes/routes/noteRoutes.js";
import userRoutes from "../features/users/routes/userRoutes.js";

// Database connection helper
import { query } from "../shared/config/db.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5001; // Default to 5001 if no PORT env var

// ==========================================
// DATABASE SETUP
// ==========================================

/**
 * Creates refresh_tokens table if it doesn't exist
 * Prevents 500 errors on fresh database installations
 */
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
// MIDDLEWARE CONFIGURATION
// ==========================================

// Parse allowed origins from environment (comma-separated) or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://127.0.0.1:5173"]; // Vite default ports

// Configure CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies and authentication headers
  }),
);

// Parse JSON request bodies (for POST/PUT requests)
app.use(express.json());

// Initialize database tables (non-blocking)
ensureRefreshTokensTable();

// ==========================================
// HEALTH CHECK ENDPOINTS
// ==========================================

/**
 * Simple health check endpoint for deployment monitoring
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "active", timestamp: new Date() });
});

// ==========================================
// API ROUTE HANDLERS
// ==========================================

// Mount feature routes with their respective base paths
app.use("/api/auth", authRoutes); // Authentication: /api/auth/login, /api/auth/register, etc.
app.use("/api/users", userRoutes); // User management: /api/users/profile, /api/users/leaderboard, etc.
app.use("/api/casts", castRoutes); // Live casts: /api/casts/, /api/casts/:id, etc.
app.use("/api/skills", skillRoutes); // Skill catalog: /api/skills/, /api/skills/add, etc.
app.use("/api/notes", noteRoutes); // Notes: /api/notes/, /api/notes/sent, etc.

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Catch-all handler for undefined routes
 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/**
 * Global error handler - catches all unhandled errors
 */
app.use((err, req, res, next) => {
  logError("app", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ==========================================
// SERVER STARTUP
// ==========================================

/**
 * Start the Express server and listen on specified port
 */
app.listen(PORT, () => {
  console.log(`✓ SkillCast Server listening on port ${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
});

export default app;
