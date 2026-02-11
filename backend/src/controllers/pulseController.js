import { query } from "../config/db.js";
import { logError } from "../utils/logger.js";

/**
 * GET PULSE FEED
 * Fetches signals created within the last 24h. Supports vibe filtering.
 */
export const getAllPulses = async (req, res) => {
  const { category, q } = req.query;
  try {
    let queryText = `
            SELECT p.*, u.username, u.karma, i.name as interest_name, i.vibe_category
            FROM pulses p
            JOIN users u ON p.creator_id = u.id
            JOIN interests i ON p.interest_id = i.id
            WHERE p.is_live = true 
            AND p.created_at > NOW() - INTERVAL '24 hours'`;

    const params = [];
    if (category) {
      params.push(category);
      queryText += ` AND i.vibe_category = $${params.length}`;
    }

    if (q) {
      params.push(`%${q}%`);
      const idx = params.length;
      queryText += ` AND (p.title ILIKE $${idx} OR p.description ILIKE $${idx} OR u.username ILIKE $${idx} OR i.name ILIKE $${idx})`;
    }

    queryText += ` ORDER BY p.created_at DESC`;
    const pulses = await query(queryText, params);
    res.json(pulses.rows);
  } catch (err) {
    logError("pulseController.getAllPulses", err, { category, q });
    res.status(500).json({ error: "Failed to fetch pulse feed" });
  }
};

/**
 * BROADCAST PULSE
 * Requirement 1.1: Must include a meeting link
 */
export const createPulse = async (req, res) => {
  const { interest_id, title, description, meeting_link } = req.body;

  if (!meeting_link || !title) {
    return res
      .status(400)
      .json({ error: "Title and Meeting Link are required" });
  }

  try {
    const newPulse = await query(
      `INSERT INTO pulses (creator_id, interest_id, title, description, meeting_link) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, interest_id, title, description, meeting_link],
    );
    res.status(201).json(newPulse.rows[0]);
  } catch (err) {
    logError("pulseController.createPulse", err, { interest_id, title });
    res.status(500).json({ error: "Could not broadcast pulse" });
  }
};

/**
 * UPDATE PULSE
 * Allows a creator (or admin) to edit the pulse details.
 */
export const updatePulse = async (req, res) => {
  const { id } = req.params;
  const { interest_id, title, description, meeting_link, is_live } = req.body;

  try {
    const updated = await query(
      `UPDATE pulses
       SET interest_id = COALESCE($3, interest_id),
           title = COALESCE($4, title),
           description = COALESCE($5, description),
           meeting_link = COALESCE($6, meeting_link),
           is_live = COALESCE($7, is_live)
       WHERE id = $1 AND (creator_id = $2 OR $8 = 'admin')
       RETURNING *`,
      [
        id,
        req.user.id,
        interest_id,
        title,
        description,
        meeting_link,
        is_live,
        req.user.role,
      ],
    );

    if (updated.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Pulse not found or permission denied" });
    }

    res.json(updated.rows[0]);
  } catch (err) {
    logError("pulseController.updatePulse", err, { id });
    res.status(500).json({ error: "Could not update pulse" });
  }
};

/**
 * DELETE PULSE
 * Requirement 1.3: Admins or Creators only
 */
export const deletePulse = async (req, res) => {
  try {
    // Ownership check is built directly into the SQL WHERE clause
    const result = await query(
      "DELETE FROM pulses WHERE id = $1 AND (creator_id = $2 OR $3 = 'admin')",
      [req.params.id, req.user.id, req.user.role],
    );

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ error: "Pulse not found or permission denied" });

    res.json({ message: "Pulse signal terminated" });
  } catch (err) {
    logError("pulseController.deletePulse", err, { id: req.params.id });
    res.status(500).json({ error: "Deletion failed" });
  }
};

/**
 * END PULSE MANUALLY
 * Allows the creator to set is_live to false, removing it from the feed.
 */
export const endPulse = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "UPDATE pulses SET is_live = false WHERE id = $1 AND creator_id = $2 RETURNING *",
      [id, req.user.id], // Only the creator can end it
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pulse not found or unauthorized" });
    }

    res.json({
      message: "Pulse session ended successfully",
      pulse: result.rows[0],
    });
  } catch (err) {
    logError("pulseController.endPulse", err, { id });
    res.status(500).json({ error: "Failed to end pulse" });
  }
};
