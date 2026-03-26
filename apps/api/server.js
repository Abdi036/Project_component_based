import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "auth/src/routes/authRoutes.js";
import studyPlanRoutes from "studyPlan/src/routes/studyPlanRoutes.js";
import { connectDB } from "auth";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/studyplan", studyPlanRoutes);

app.get("/", (req, res) => {
  res.send("API Running with MongoDB Integration");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
