import express from "express";
import multer from "multer";
import {
  updateProfile,
  updatePassword,
  deductToken,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.put("/updateprofile", protect, upload.single("avatar"), updateProfile);
router.patch("/updatepassword", protect, updatePassword);
router.post("/deduct-token", protect, deductToken);

export default router;
