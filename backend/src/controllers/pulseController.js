import { query } from "../config/db.js";

/**
 * GET PULSE FEED
 * Fetches signals created within the last 24h. Supports vibe filtering.
 */
export const getAllPulses = async (req, res) => {
  const { category } = req.query;
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
      queryText += ` AND i.vibe_category = $1`;
      params.push(category);
    }

    queryText += ` ORDER BY p.created_at DESC`;
    const pulses = await query(queryText, params);
    res.json(pulses.rows);
  } catch (err) {
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
    res.status(500).json({ error: "Could not broadcast pulse" });
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
    res.status(500).json({ error: "Failed to end pulse" });
  }
};
