import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};