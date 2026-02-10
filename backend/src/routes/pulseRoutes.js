import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createPulse,
  getAllPulses,
  updatePulse,
  deletePulse,
} from "../controllers/pulseController.js";

const router = express.Router();

// Public Feed
router.get("/", getAllPulses);

// Protected Actions
router.post("/", authenticateToken, createPulse);
router.put("/:id", authenticateToken, updatePulse);
router.delete("/:id", authenticateToken, deletePulse);

export default router;
