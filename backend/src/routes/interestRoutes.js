import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  getAllInterests,
  getUserInterests,
  addUserInterest,
} from "../controllers/interestController.js";

const router = express.Router();

// Publicly available catalog
router.get("/", getAllInterests);

// Get interests for a specific profile
router.get("/user/:userId", getUserInterests);

// Protected: Add a vibe to your own profile
router.post("/add", authenticateToken, addUserInterest);

export default router;
