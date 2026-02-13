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
 * Retrieves active casts with filtering and search capabilities
 * Shows LIVE and ENDED casts to all users (PAUSED casts are hidden from feed)
 * Supports filtering by skill category and text search
 *
 * Query parameters:
 * - category: Filter by skill category
 * - q: Search in title, description, username, or skill name
 */
export const getAllCasts = async (req, res) => {
  const { category, q } = req.query;

  try {
    // Base query: Get LIVE and ENDED casts (exclude PAUSED and ARCHIVED) from last 24 hours
    let queryText = `
      SELECT c.*, u.username, u.credit, s.name as skill_name, s.category
      FROM casts c
      JOIN users u ON c.creator_id = u.id
      JOIN skills s ON c.skill_id = s.id
      WHERE c.status IN ('LIVE', 'ENDED')
      AND c.created_at > NOW() - INTERVAL '24 hours'`;

    const params = [];

    // Add category filter if specified
    if (category) {
      params.push(category);
      queryText += ` AND s.category = $${params.length}`;
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
  const { skill_id, title, description, meeting_link, status } = req.body;

  try {
    // Update cast with permission check in WHERE clause
    const updated = await query(
      `UPDATE casts
       SET skill_id = COALESCE($3, skill_id),
           title = COALESCE($4, title),
           description = COALESCE($5, description),
           meeting_link = COALESCE($6, meeting_link),
           status = COALESCE($7, status)
       WHERE id = $1 AND (creator_id = $2 OR $8 = 'admin')
       RETURNING *`,
      [
        id,
        req.user.id,
        skill_id,
        title,
        description,
        meeting_link,
        status,
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
 * Archives a cast (soft delete)
 * Only the cast creator or admins can archive casts
 * Sets status to ARCHIVED instead of deleting from database
 * This preserves cast history for user's profile
 */
export const deleteCast = async (req, res) => {
  try {
    // Soft delete: Set status to ARCHIVED instead of deleting
    const result = await query(
      "UPDATE casts SET status = 'ARCHIVED' WHERE id = $1 AND (creator_id = $2 OR $3 = 'admin') RETURNING *",
      [req.params.id, req.user.id, req.user.role],
    );

    // Check if cast was found and user had permission
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Cast not found or permission denied" });
    }

    res.json({ message: "Cast archived successfully", cast: result.rows[0] });
  } catch (err) {
    logError("castController.deleteCast", err, { id: req.params.id });
    res.status(500).json({ error: "Archive failed" });
  }
};

/**
 * Get archived/past casts for a specific user
 * Returns all casts with ARCHIVED status for the specified user
 * Accessible by the user themselves or admins
 */
export const getPastCasts = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get archived casts for this user
    const pastCasts = await query(
      `SELECT c.*, s.name as skill_name, s.channel
       FROM casts c
       JOIN skills s ON c.skill_id = s.id
       WHERE c.creator_id = $1 AND c.status = 'ARCHIVED'
       ORDER BY c.updated_at DESC`,
      [userId],
    );

    res.json(pastCasts.rows);
  } catch (err) {
    logError("castController.getPastCasts", err, { userId });
    res.status(500).json({ error: "Failed to fetch past casts" });
  }
};
