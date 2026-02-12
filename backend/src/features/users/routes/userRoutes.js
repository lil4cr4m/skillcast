/**
 * USER MANAGEMENT ROUTES
 * Defines endpoints for user profiles, leaderboard, and admin user management
 * Includes public endpoints (profiles, leaderboard) and protected admin operations
 */

import express from "express";
import {
  getProfile,
  updateProfile,
  getLeaderboard,
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../../../shared/middleware/authMiddleware.js";

// Create Express router for user endpoints
const router = express.Router();

// ==========================================
// PUBLIC USER ROUTES
// ==========================================

/**
 * GET /api/users/leaderboard
 * Retrieves top 10 users by credit score
 * Public endpoint - no authentication required
 */
router.get("/leaderboard", getLeaderboard);

/**
 * GET /api/users/profile/:id
 * Retrieves user profile with activity statistics
 * Shows user info, total casts, and notes received
 * Public endpoint - no authentication required
 */
router.get("/profile/:id", getProfile);

// ==========================================
// PROTECTED USER ROUTES
// ==========================================

/**
 * PUT /api/users/profile/:id
 * Updates user profile information (name, bio)
 * Users can update their own profile, admins can update any profile
 * Headers: Authorization: Bearer <accessToken>
 * Body: { name?, bio? }
 */
router.put("/profile/:id", authenticateToken, updateProfile);

// ==========================================
// ADMIN-ONLY USER ROUTES
// ==========================================

/**
 * GET /api/users/admin/all
 * Retrieves all users for admin management dashboard
 * Admin-only endpoint with role checking
 * Headers: Authorization: Bearer <accessToken> (admin role required)
 */
router.get("/admin/all", authenticateToken, getAllUsers);

/**
 * PUT /api/users/admin/:id
 * Updates any user's account details (name, credit, role)
 * Admin-only operation for user management
 * Headers: Authorization: Bearer <accessToken> (admin role required)
 * Body: { name?, credit?, role? }
 */
router.put("/admin/:id", authenticateToken, updateUser);

/**
 * DELETE /api/users/:id
 * Deletes a user account and all associated data
 * Admin-only operation with safety checks (cannot delete own account)
 * Headers: Authorization: Bearer <accessToken> (admin role required)
 */
router.delete("/:id", authenticateToken, deleteUser);

export default router;
