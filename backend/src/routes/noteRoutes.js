import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createNote, getUserNotes } from "../controllers/noteController.js";

const router = express.Router();

// Get notes for a specific user's profile (Public)
router.get("/user/:userId", getUserNotes);

// Send a note (Protected - must be logged in)
router.post("/", authenticateToken, createNote);

export default router;
