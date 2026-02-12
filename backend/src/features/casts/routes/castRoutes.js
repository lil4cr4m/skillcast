/**
 * CAST ROUTES CONFIGURATION
 * Defines all endpoints for live broadcasting functionality
 * Manages live session creation, updates, deletion, and public feed
 */

import express from "express";
import { authenticateToken } from "../../../shared/middleware/authMiddleware.js";
import {
  createCast,
  getAllCasts,
  updateCast,
  deleteCast,
} from "../controllers/castController.js";

const router = express.Router();

// ==========================================
// PUBLIC ENDPOINTS - No Authentication Required
// ==========================================

/**
 * GET /api/casts/
 * Retrieves the public cast feed with filtering capabilities
 * Shows active live broadcasts from the last 24 hours
 *
 * Query Parameters:
 * - category: Filter by skill channel/category
 * - q: Search query for title, description, username, or skill name
 */
router.get("/", getAllCasts);

// ==========================================
// PROTECTED ENDPOINTS - Authentication Required
// ==========================================

/**
 * POST /api/casts/
 * Creates a new live broadcast session
 * Requires authentication - creator must be logged in
 *
 * Body Parameters:
 * - skill_id: Required - Which skill is being taught
 * - title: Required - Cast session title
 * - description: Optional - Detailed description
 * - meeting_link: Required - Live session meeting URL
 */
router.post("/", authenticateToken, createCast);

/**
 * PUT /api/casts/:id
 * Updates an existing cast's details
 * Only the creator or admin users can modify casts
 *
 * Path Parameters:
 * - id: Cast UUID to update
 *
 * Body Parameters (all optional):
 * - skill_id: Change associated skill
 * - title: Update cast title
 * - description: Update cast description
 * - meeting_link: Update meeting URL
 * - is_live: Toggle live status (end broadcast)
 */
router.put("/:id", authenticateToken, updateCast);

/**
 * DELETE /api/casts/:id
 * Permanently removes a cast and all related data
 * Only the creator or admin users can delete casts
 * CASCADE deletes handle related notes automatically
 *
 * Path Parameters:
 * - id: Cast UUID to delete
 */
router.delete("/:id", authenticateToken, deleteCast);

export default router;
