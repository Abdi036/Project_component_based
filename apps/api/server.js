import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "auth/src/routes/authRoutes.js";
import profileRoutes from "auth/src/routes/profileRoutes.js";
import studyPlanRoutes from "studyplan/src/routes/studyPlanRoutes.js";
import interviewRoutes from "interview/src/routes/interviewRoutes.js";
import pricingRoutes from "pricing/src/routes/pricingRoutes.js";
import { paymentRoutes } from 'pricing';
import { connectDB } from "auth";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/studyplan", studyPlanRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/pricing", pricingRoutes);
app.use('/api/v1/payment', paymentRoutes);

app.get("/", (req, res) => {
  res.send("API Running with MongoDB Integration");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
