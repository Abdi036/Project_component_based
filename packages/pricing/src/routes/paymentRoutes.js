import express from "express";
import { protect } from "auth/src/middleware/authMiddleware.js";
import {
  createOrder,
  confirmTestPayment,
  paymentNotify,
  verifyPayment,
  getMyTransactions,
} from "../controllers/paymentController.js";

const router = express.Router();

// Protected payment routes
router.post("/create-order", protect, createOrder);
router.get("/verify/:orderId", protect, verifyPayment);
router.get("/history", protect, getMyTransactions);

// Webhook and public routes
router.post("/notify", paymentNotify);

// Disabled test endpoint
router.post("/confirm-test-payment", protect, confirmTestPayment);

export default router;
