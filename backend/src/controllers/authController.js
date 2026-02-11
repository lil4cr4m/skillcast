import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { logError } from "../utils/logger.js";

// Prefer dedicated refresh secret; provide dev-safe defaults if env is missing to avoid 500s locally
const ACCESS_SECRET = process.env.JWT_SECRET || "dev_access_secret";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  process.env.JWT_SECRET ||
  "dev_refresh_secret";
/**
 * TOKEN GENERATOR
 * Returns a 15-minute access token and a 7-day refresh token.
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "15m" }, // Short-lived for security
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: "7d" }, // Long-lived for persistence
  );
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  // Basic Validation
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Missing required registration fields" });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPwd = await bcrypt.hash(password, salt);

    const newUser = await query(
      "INSERT INTO users (username, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING id, username, role",
      [username, email, hashedPwd, name],
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    logError("authController.register", err, { email, username });
    res
      .status(500)
      .json({ error: "Registration failed: Email/Username likely taken." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!ACCESS_SECRET || !REFRESH_SECRET) {
      return res.status(500).json({
        error:
          "Server auth secrets missing. Please set JWT_SECRET and JWT_REFRESH_SECRET",
      });
    }

    const userRes = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userRes.rows.length === 0)
      return res.status(401).json({ error: "Invalid Credentials" });

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to DB to allow revocation (Requirement 1.4)
    await query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
      [user.id, refreshToken],
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        credit: user.credit,
      },
    });
  } catch (err) {
    logError("authController.login", err, { email });
    res.status(500).json({ error: "Login server error" });
  }
};

/**
 * REFRESH TOKEN ENDPOINT
 * Allows frontend to get a new access token using the refresh token
 */
export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: "Refresh token required" });

  try {
    // Check if token exists in DB
    const tokenInDb = await query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [token],
    );
    if (tokenInDb.rows.length === 0)
      return res.status(403).json({ error: "Token revoked" });

    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await query("SELECT id, role FROM users WHERE id = $1", [
      decoded.id,
    ]);

    const newTokens = generateTokens(user.rows[0]);
    res.json({ accessToken: newTokens.accessToken });
  } catch (err) {
    logError("authController.refreshToken", err);
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

/**
 * LOGOUT
 * Removes refresh token from DB to end session (Security Best Practice)
 */
export const logout = async (req, res) => {
  const { token } = req.body;
  try {
    await query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    logError("authController.logout", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Current and new password are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ error: "New password must be at least 8 characters" });
  }

  try {
    const userRes = await query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [userId],
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userRes.rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(newPassword, salt);

    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashed,
      userId,
    ]);

    // Invalidate existing refresh tokens so sessions are renewed
    await query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    logError("authController.changePassword", err, { userId });
    res.status(500).json({ error: "Failed to update password" });
  }
};
