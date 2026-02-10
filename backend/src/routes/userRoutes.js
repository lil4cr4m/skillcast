import express from "express";
import { getProfile, getLeaderboard } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 */
// Fetch the top 10 users by Karma
router.get("/leaderboard", getLeaderboard);

// View a specific user's impact stats and bio
router.get("/profile/:id", getProfile);

/**
 * PROTECTED ROUTES (Optional additions)
 */
// router.put('/profile', authenticateToken, updateProfile);

export default router;
