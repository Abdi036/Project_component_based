import express from "express";
import {
  login,
  register,
  getProfile,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes (Authentication Required)
router.get("/profile", protect, getProfile);

// Example of Authorization (Role Required: admin)
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

export default router;
