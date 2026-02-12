/**
 * GRATITUDE NOTES CONTROLLER
 * Handles the appreciation system where users send thank-you notes to cast creators
 * Automatically triggers credit rewards through database triggers
 * Prevents self-gratitude and manages note CRUD operations
 */

import { query } from "../../../shared/config/db.js";
import { logError } from "../../../shared/utils/logger.js";

// ==========================================
// GRATITUDE SYSTEM ENDPOINTS
// ==========================================

/**
 * Creates a new gratitude note and triggers automatic credit reward
 * When someone sends gratitude for a cast, the creator receives +10 credits
 * Includes fraud prevention by blocking self-gratitude (except for admin users)
 * Admin users can send gratitude notes to any cast, including their own
 *
 * Database triggers handle the credit awarding automatically
 *
 * Body parameters:
 * - cast_id: UUID of the cast being appreciated
 * - content: The gratitude message text
 */
export const createNote = async (req, res) => {
  const { cast_id, content } = req.body;

  try {
    // Security check: Prevent gratitude fraud by blocking self-appreciation
    // Users cannot send gratitude to their own casts to farm credits
    // Exception: Admin users can send gratitude to any cast
    const castOwner = await query(
      "SELECT creator_id FROM casts WHERE id = $1",
      [cast_id],
    );
    if (
      castOwner.rows[0].creator_id === req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(400)
        .json({ error: "You cannot send gratitude to your own cast" });
    }

    // Insert the gratitude note - database trigger handles credit reward
    const newNote = await query(
      "INSERT INTO gratitude_notes (cast_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *",
      [cast_id, req.user.id, content],
    );

    // Fetch creator info for user-friendly confirmation message
    const creatorRes = await query(
      "SELECT u.username FROM users u JOIN casts c ON u.id = c.creator_id WHERE c.id = $1",
      [cast_id],
    );

    res.status(201).json({
      message: `Gratitude logged! ${creatorRes.rows[0].username} earned +10 Credit.`,
      note: newNote.rows[0],
    });
  } catch (err) {
    logError("noteController.createNote", err, { cast_id });
    res.status(500).json({ error: "Failed to send gratitude note" });
  }
};

/**
 * Retrieves all gratitude notes received by a specific user across all their casts
 * Shows appreciation history for cast creators
 * Includes cast context and sender information
 *
 * Path parameters:
 * - userId: UUID of the user whose received notes to fetch
 */
export const getUserNotes = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get all notes left on casts created by the specified user
    const notes = await query(
      `SELECT gn.id,
              gn.content,
              gn.created_at,
              c.title AS cast_title,
              u.username AS sender_username
       FROM gratitude_notes gn
        JOIN casts c ON gn.cast_id = c.id
       LEFT JOIN users u ON gn.sender_id = u.id
        WHERE c.creator_id = $1
       ORDER BY gn.created_at DESC`,
      [userId],
    );

    res.json(notes.rows);
  } catch (err) {
    logError("noteController.getUserNotes", err, { userId });
    res.status(500).json({ error: "Failed to fetch gratitude notes" });
  }
};

/**
 * Retrieves all gratitude notes sent by the currently authenticated user
 * Shows user's own gratitude history across all casts they've appreciated
 * Useful for tracking what appreciation they've given
 */
export const getSentNotes = async (req, res) => {
  try {
    // Get all notes sent by the authenticated user
    const notes = await query(
      `SELECT gn.id,
              gn.content,
              gn.created_at,
              c.title AS cast_title,
              c.id   AS cast_id
       FROM gratitude_notes gn
        JOIN casts c ON gn.cast_id = c.id
       WHERE gn.sender_id = $1
       ORDER BY gn.created_at DESC`,
      [req.user.id],
    );

    res.json(notes.rows);
  } catch (err) {
    logError("noteController.getSentNotes", err, { userId: req.user.id });
    res.status(500).json({ error: "Failed to fetch sent notes" });
  }
};

/**
 * Updates the content of an existing gratitude note
 * Only the original sender or admin users can edit notes
 * Preserves all other note metadata (timestamps, recipients, etc.)
 *
 * Path parameters:
 * - id: UUID of the note to update
 *
 * Body parameters:
 * - content: New note content (required)
 */
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Validate required content field
  if (!content) return res.status(400).json({ error: "Content is required" });

  try {
    // Update note with permission check - sender or admin only
    const result = await query(
      `UPDATE gratitude_notes gn
       SET content = $1
       WHERE gn.id = $2
         AND (gn.sender_id = $3 OR $4 = 'admin')
       RETURNING *`,
      [content, id, req.user.id, req.user.role],
    );

    // Check if note was found and user has permission
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Note not found or permission denied" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logError("noteController.updateNote", err, { id });
    res.status(500).json({ error: "Failed to update note" });
  }
};

/**
 * Permanently deletes a gratitude note
 * Multiple permission levels: sender, cast creator, or admin users
 * Uses JOIN to verify permissions across note and cast ownership
 *
 * Path parameters:
 * - id: UUID of the note to delete
 */
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete with complex permission check:
    // - Note sender can delete their own note
    // - Cast creator can moderate notes on their casts
    // - Admin users can delete any note
    const result = await query(
      `DELETE FROM gratitude_notes gn
       USING casts c
       WHERE gn.id = $1
         AND gn.cast_id = c.id
         AND (gn.sender_id = $2 OR c.creator_id = $2 OR $3 = 'admin')`,
      [id, req.user.id, req.user.role],
    );

    // Check if note was found and user has permission
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Note not found or permission denied" });
    }

    res.json({ message: "Note removed" });
  } catch (err) {
    logError("noteController.deleteNote", err, { id });
    res.status(500).json({ error: "Failed to delete note" });
  }
};
