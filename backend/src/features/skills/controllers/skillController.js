/**
 * SKILLS CATALOG CONTROLLER
 * Manages the global skill/topic database and user skill profiles
 * Handles skill discovery, user skill pinning, and admin catalog management
 * Skills are organized by categories for better discovery
 */

import { query } from "../../../shared/config/db.js";
import { logError } from "../../../shared/utils/logger.js";

// ==========================================
// PUBLIC SKILL ENDPOINTS
// ==========================================

/**
 * Retrieves the complete global skills catalog
 * Shows all available skills organized by category
 * Used for skill discovery and cast creation selection
 *
 * Returns skills sorted alphabetically within each category
 */
export const getAllSkills = async (req, res) => {
  try {
    // Get complete skill catalog ordered by category then name
    const result = await query(
      "SELECT * FROM skills ORDER BY category, name ASC",
    );
    res.json(result.rows);
  } catch (err) {
    logError("skillController.getAllSkills", err);
    res.status(500).json({ error: "Failed to fetch skill catalog" });
  }
};

/**
 * Retrieves skills pinned to a specific user's profile
 * Shows what topics/expertise a user specializes in
 * Public endpoint for profile viewing and instructor discovery
 *
 * Path parameters:
 * - userId: UUID of the user whose skills to fetch
 */
export const getUserSkills = async (req, res) => {
  const { userId } = req.params;

  try {
    // Join user_skills mapping table with skills for full details
    const result = await query(
      `SELECT s.*
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1
       ORDER BY s.category, s.name`,
      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    logError("skillController.getUserSkills", err, { userId });
    res.status(500).json({ error: "Failed to fetch user skills" });
  }
};

// ==========================================
// PROTECTED USER ENDPOINTS
// ==========================================

/**
 * Pins a skill to the authenticated user's profile
 * Allows users to showcase their expertise and interests
 * Uses ON CONFLICT DO NOTHING to prevent duplicate pinning
 *
 * Body parameters:
 * - skillId: UUID of the skill to pin to profile
 */
export const addUserSkill = async (req, res) => {
  const { skillId } = req.body;

  // Validate required skill ID
  if (!skillId) return res.status(400).json({ error: "No Skill ID provided" });

  try {
    // Add skill to user's profile, ignore if already exists
    await query(
      "INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [req.user.id, skillId],
    );
    res.status(201).json({ message: "Skill pinned to profile" });
  } catch (err) {
    logError("skillController.addUserSkill", err, {
      userId: req.user.id,
      skillId,
    });
    res.status(500).json({ error: "Could not update profile skills" });
  }
};

// ==========================================
// ADMIN-ONLY SKILL MANAGEMENT
// ==========================================

/**
 * Creates a new skill in the global catalog
 * Admin-only operation to expand available topics
 * Skills must have both name and category
 *
 * Body parameters:
 * - name: The skill/topic name (e.g., "React Hooks")
 * - category: The category (e.g., "Programming", "Design")
 */
export const createSkill = async (req, res) => {
  const { name, category } = req.body;

  // Verify admin access
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  // Validate required fields
  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
  }

  try {
    // Insert new skill into catalog
    const result = await query(
      "INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING *",
      [name, category],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    logError("skillController.createSkill", err, { name, category });
    res.status(500).json({ error: "Failed to create skill" });
  }
};

/**
 * Updates an existing skill's details
 * Admin-only operation to maintain catalog accuracy
 * Can modify both name and category classification
 *
 * Path parameters:
 * - id: UUID of the skill to update
 *
 * Body parameters:
 * - name: Required - Updated skill name
 * - category: Required - Updated category
 */
export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;

  // Verify admin access
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  // Validate required fields
  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
  }

  try {
    // Update skill with new details
    const result = await query(
      "UPDATE skills SET name = $1, category = $2 WHERE id = $3 RETURNING *",
      [name, category, id],
    );

    // Check if skill exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logError("skillController.updateSkill", err, { id, name, category });
    res.status(500).json({ error: "Failed to update skill" });
  }
};

/**
 * Permanently removes a skill from the catalog
 * Admin-only operation with CASCADE implications
 * Will affect existing casts and user profiles using this skill
 *
 * Path parameters:
 * - id: UUID of the skill to delete
 */
export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  // Verify admin access
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    // Delete skill from catalog
    const result = await query(
      "DELETE FROM skills WHERE id = $1 RETURNING id",
      [id],
    );

    // Check if skill existed
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    logError("skillController.deleteSkill", err, { id });
    res.status(500).json({ error: "Failed to delete skill" });
  }
};
