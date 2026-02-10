import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

/**
 * TOKEN GENERATOR
 * Returns a 15-minute access token and a 7-day refresh token.
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }, // Short-lived for security
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
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
    res
      .status(500)
      .json({ error: "Registration failed: Email/Username likely taken." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
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

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await query("SELECT id, role FROM users WHERE id = $1", [
      decoded.id,
    ]);

    const newTokens = generateTokens(user.rows[0]);
    res.json({ accessToken: newTokens.accessToken });
  } catch (err) {
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
    res.status(500).json({ error: "Logout failed" });
  }
};
