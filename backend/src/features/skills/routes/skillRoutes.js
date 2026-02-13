/**
 * SKILLS ROUTES CONFIGURATION
 * Defines all endpoints for skill catalog management and user skill profiles
 * Handles skill discovery, user profile management, and admin catalog operations
 * Skills are organized by categories for better categorization and discovery
 */

import express from "express";
import { authenticateToken } from "../../../shared/middleware/authMiddleware.js";
import {
  getAllSkills,
  getUserSkills,
  addUserSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

const router = express.Router();

// ==========================================
// PUBLIC ENDPOINTS - No Authentication Required
// ==========================================

/**
 * GET /api/skills/
 * Retrieves the complete global skills catalog
 * Shows all available skills organized by category
 * Used for skill discovery, cast creation, and browsing topics
 * Returns data sorted alphabetically within each category
 */
router.get("/", getAllSkills);

/**
 * GET /api/skills/user/:userId
 * Retrieves skills pinned to a specific user's profile
 * Shows what topics/expertise a user specializes in
 * Public for instructor discovery and profile viewing
 *
 * Path Parameters:
 * - userId: UUID of the user whose skills to fetch
 */
router.get("/user/:userId", getUserSkills);

// ==========================================
// PROTECTED USER ENDPOINTS - Authentication Required
// ==========================================

/**
 * POST /api/skills/add
 * Pins a skill to the authenticated user's profile
 * Allows users to showcase their expertise and interests
 * Prevents duplicate pinning through database constraints
 *
 * Body Parameters:
 * - skillId: Required - UUID of the skill to pin to profile
 */
router.post("/add", authenticateToken, addUserSkill);

// ==========================================
// ADMIN-ONLY ENDPOINTS - Admin Role Required
// ==========================================

/**
 * POST /api/skills/
 * Creates a new skill in the global catalog
 * Admin-only operation to expand available topics
 *
 * Body Parameters:
 * - name: Required - The skill/topic name (e.g., "React Hooks")
 * - category: Required - The category (e.g., "Programming", "Design")
 */
router.post("/", authenticateToken, createSkill);

/**
 * PUT /api/skills/:id
 * Updates an existing skill's details
 * Admin-only operation to maintain catalog accuracy
 *
 * Path Parameters:
 * - id: UUID of the skill to update
 *
 * Body Parameters:
 * - name: Required - Updated skill name
 * - category: Required - Updated category
 */
router.put("/:id", authenticateToken, updateSkill);

/**
 * DELETE /api/skills/:id
 * Permanently removes a skill from the catalog
 * Admin-only operation with CASCADE implications
 * Will affect existing casts and user profiles using this skill
 *
 * Path Parameters:
 * - id: UUID of the skill to delete
 */
router.delete("/:id", authenticateToken, deleteSkill);

export default router;
