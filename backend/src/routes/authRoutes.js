import express from "express";
import {
  register,
  login,
  refreshToken,
  changePassword,
  logout,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/change-password", authenticateToken, changePassword);
router.post("/logout", authenticateToken, logout);

export default router;
