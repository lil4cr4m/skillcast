/**
 * USER MANAGEMENT CONTROLLER
 * Handles user profiles, leaderboard display, and admin user management
 * Includes public endpoints (profiles, leaderboard) and admin-only operations
 */

import { query } from "../../../shared/config/db.js";
import { logError } from "../../../shared/utils/logger.js";

// ==========================================
// PUBLIC USER ENDPOINTS
// ==========================================

/**
 * Retrieves user profile with aggregated statistics
 * Shows user info, total casts created, and notes received
 *
 * @param {object} req - Express request object with user ID in params
 * @param {object} res - Express response object
 */
export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Complex query to get user data with activity statistics
    const userStats = await query(
      `
        SELECT 
          u.id, u.username, u.name, u.bio, u.credit, u.role, u.created_at,
          (SELECT COUNT(*) FROM casts WHERE creator_id = $1) as total_casts,
          (SELECT COUNT(*) FROM notes n 
           JOIN casts c ON n.cast_id = c.id 
           WHERE c.creator_id = $1) as notes_received
        FROM users u
        WHERE u.id = $1`,
      [id],
    );

    // Check if user exists
    if (userStats.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile with statistics
    res.json(userStats.rows[0]);
  } catch (err) {
    logError("userController.getProfile", err, { id });
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

/**
 * Retrieves the top 10 users by credit score for the leaderboard
 * Public endpoint - no authentication required
 */
export const getLeaderboard = async (req, res) => {
  try {
    // Get top 10 users ordered by credit score
    const leaders = await query(
      "SELECT id, username, credit FROM users ORDER BY credit DESC LIMIT 10",
    );
    res.json(leaders.rows);
  } catch (err) {
    logError("userController.getLeaderboard", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// ==========================================
// PROTECTED USER ENDPOINTS
// ==========================================

/**
 * Updates user profile information (name and bio)
 * Users can only update their own profile, admins can update any profile
 */
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  // Check if user owns this profile or is an admin
  const isOwner = req.user && req.user.id?.toString() === id?.toString();
  const isAdmin = req.user && req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    // Update user profile with new information
    const result = await query(
      `UPDATE users 
       SET name = $1, bio = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING id, username, email, name, bio, credit, role, created_at`,
      [name ?? null, bio ?? null, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logError("userController.updateProfile", err, { id });
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// ==========================================
// ADMIN-ONLY ENDPOINTS
// ==========================================

/**
 * Retrieves all users for admin management dashboard
 * Admin-only endpoint with role checking
 */
export const getAllUsers = async (req, res) => {
  // Verify admin role
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin only" });
  }

  try {
    // Get all users with full details, ordered by registration date
    const users = await query(
      `SELECT id, username, email, name, bio, credit, role, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`,
    );
    res.json(users.rows);
  } catch (err) {
    logError("userController.getAllUsers", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * Deletes a user account and all associated data
 * Admin-only operation with safety checks
 */
export const deleteUser = async (req, res) => {
  // Verify admin role
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin only" });
  }

  const { id } = req.params;

  try {
    // Prevent admins from deleting their own account
    if (req.user.id?.toString() === id?.toString()) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    // Delete user (CASCADE constraints handle related records)
    const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      id: result.rows[0].id,
    });
  } catch (err) {
    logError("userController.deleteUser", err, { id });
    res.status(500).json({ error: "Failed to delete user" });
  }
};

/**
 * Updates user account details (name, credit, role)
 * Admin-only operation for managing user accounts
 */
export const updateUser = async (req, res) => {
  // Verify admin role
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin only" });
  }

  const { id } = req.params;
  const { name, credit, role } = req.body;

  try {
    // Prevent admins from downgrading their own role
    if (req.user.id?.toString() === id?.toString() && role === "member") {
      return res
        .status(400)
        .json({ error: "Cannot downgrade your own admin role" });
    }

    // Update user with new values (COALESCE keeps existing values for null inputs)
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           credit = COALESCE($2, credit), 
           role = COALESCE($3, role), 
           updated_at = NOW() 
       WHERE id = $4 
       RETURNING id, username, email, name, bio, credit, role, created_at, updated_at`,
      [name ?? null, credit ?? null, role ?? null, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logError("userController.updateUser", err, { id });
    res.status(500).json({ error: "Failed to update user" });
  }
};
