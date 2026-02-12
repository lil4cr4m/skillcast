/**
 * NOTES ROUTES CONFIGURATION
 * Defines all endpoints for the appreciation and feedback system
 * Manages thank-you notes that users send to cast creators
 * Includes automatic credit rewards through database triggers
 */

import express from "express";
import { authenticateToken } from "../../../shared/middleware/authMiddleware.js";
import {
  createNote,
  getUserNotes,
  getSentNotes,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

// ==========================================
// PUBLIC ENDPOINTS - No Authentication Required
// ==========================================

/**
 * GET /api/notes/user/:userId
 * Retrieves all notes received by a specific user
 * Shows appreciation history for cast creators on their profile
 * Public endpoint to display social proof
 *
 * Path Parameters:
 * - userId: UUID of the user whose received notes to fetch
 */
router.get("/user/:userId", getUserNotes);

// ==========================================
// PROTECTED ENDPOINTS - Authentication Required
// ==========================================

/**
 * GET /api/notes/sent
 * Retrieves all notes sent by the authenticated user
 * Shows user's own note history and activity
 * Useful for tracking personal note contributions
 */
router.get("/sent", authenticateToken, getSentNotes);

/**
 * POST /api/notes/
 * Creates a new note for a cast
 * Automatically triggers +10 credit reward for cast creator
 * Includes fraud prevention against self-notes
 *
 * Body Parameters:
 * - cast_id: Required - UUID of the cast being appreciated
 * - content: Required - The thank-you message text
 */
router.post("/", authenticateToken, createNote);

/**
 * PUT /api/notes/:id
 * Updates the content of an existing note
 * Only the original sender or admin users can edit notes
 * Preserves timestamps and other metadata
 *
 * Path Parameters:
 * - id: UUID of the note to update
 *
 * Body Parameters:
 * - content: Required - New note content
 */
router.put("/:id", authenticateToken, updateNote);

/**
 * DELETE /api/notes/:id
 * Permanently removes a note
 * Multi-level permissions: sender, cast creator, or admin
 * Allows moderation of inappropriate content
 *
 * Path Parameters:
 * - id: UUID of the note to delete
 */
router.delete("/:id", authenticateToken, deleteNote);

export default router;
