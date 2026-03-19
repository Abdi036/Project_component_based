import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI || "mongodb://localhost:27017/turborepo_auth";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
