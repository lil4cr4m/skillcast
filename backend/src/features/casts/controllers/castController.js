/**
 * CAST MANAGEMENT CONTROLLER
 * Handles live broadcasting sessions (previously called "pulses")
 * Manages cast creation, updates, deletion, and feed retrieval with filtering
 */

import { query } from "../../../shared/config/db.js";
import { logError } from "../../../shared/utils/logger.js";

// ==========================================
// PUBLIC CAST ENDPOINTS
// ==========================================

/**
 * Retrieves active live casts with filtering and search capabilities
 * Shows casts created within the last 24 hours that are marked as live
 * Supports filtering by skill category and text search
 *
 * Query parameters:
 * - category: Filter by skill channel/category
 * - q: Search in title, description, username, or skill name
 */
export const getAllCasts = async (req, res) => {
  const { category, q } = req.query;

  try {
    // Base query: Get live casts from last 24 hours with user and skill info
    let queryText = `
      SELECT c.*, u.username, u.credit, s.name as skill_name, s.channel
      FROM casts c
      JOIN users u ON c.creator_id = u.id
      JOIN skills s ON c.skill_id = s.id
      WHERE c.is_live = true 
      AND c.created_at > NOW() - INTERVAL '24 hours'`;

    const params = [];

    // Add category filter if specified
    if (category) {
      params.push(category);
      queryText += ` AND s.channel = $${params.length}`;
    }

    // Add text search across multiple fields if specified
    if (q) {
      params.push(`%${q}%`);
      const idx = params.length;
      queryText += ` AND (c.title ILIKE $${idx} OR c.description ILIKE $${idx} OR u.username ILIKE $${idx} OR s.name ILIKE $${idx})`;
    }

    // Order by most recent first
    queryText += ` ORDER BY c.created_at DESC`;

    const casts = await query(queryText, params);
    res.json(casts.rows);
  } catch (err) {
    logError("castController.getAllCasts", err, { category, q });
    res.status(500).json({ error: "Failed to fetch cast feed" });
  }
};

// ==========================================
// PROTECTED CAST ENDPOINTS
// ==========================================

/**
 * Creates a new live broadcast session
 * Requires authentication and validates essential fields
 * Meeting link is mandatory for live sessions
 */
export const createCast = async (req, res) => {
  const { skill_id, title, description, meeting_link } = req.body;

  // Validate required fields
  if (!meeting_link || !title) {
    return res
      .status(400)
      .json({ error: "Title and Meeting Link are required" });
  }

  try {
    // Create new cast with authenticated user as creator
    const newCast = await query(
      `INSERT INTO casts (creator_id, skill_id, title, description, meeting_link) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, skill_id, title, description, meeting_link],
    );

    res.status(201).json(newCast.rows[0]);
  } catch (err) {
    logError("castController.createCast", err, { skill_id, title });
    res.status(500).json({ error: "Could not start cast" });
  }
};

/**
 * Updates an existing cast's details
 * Only the cast creator or admins can update cast information
 * Uses COALESCE to update only provided fields
 */
export const updateCast = async (req, res) => {
  const { id } = req.params;
  const { skill_id, title, description, meeting_link, is_live } = req.body;

  try {
    // Update cast with permission check in WHERE clause
    const updated = await query(
      `UPDATE casts
       SET skill_id = COALESCE($3, skill_id),
           title = COALESCE($4, title),
           description = COALESCE($5, description),
           meeting_link = COALESCE($6, meeting_link),
           is_live = COALESCE($7, is_live)
       WHERE id = $1 AND (creator_id = $2 OR $8 = 'admin')
       RETURNING *`,
      [
        id,
        req.user.id,
        skill_id,
        title,
        description,
        meeting_link,
        is_live,
        req.user.role,
      ],
    );

    // Check if cast was found and user has permission
    if (updated.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Cast not found or permission denied" });
    }

    res.json(updated.rows[0]);
  } catch (err) {
    logError("castController.updateCast", err, { id });
    res.status(500).json({ error: "Could not update cast" });
  }
};

/**
 * Permanently deletes a cast and all associated data
 * Only the cast creator or admins can delete casts
 * CASCADE constraints automatically handle related notes
 */
export const deleteCast = async (req, res) => {
  try {
    // Delete cast with ownership/admin permission check
    const result = await query(
      "DELETE FROM casts WHERE id = $1 AND (creator_id = $2 OR $3 = 'admin')",
      [req.params.id, req.user.id, req.user.role],
    );

    // Check if cast was found and user had permission
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Cast not found or permission denied" });
    }

    res.json({ message: "Cast ended" });
  } catch (err) {
    logError("castController.deleteCast", err, { id: req.params.id });
    res.status(500).json({ error: "Deletion failed" });
  }
};
