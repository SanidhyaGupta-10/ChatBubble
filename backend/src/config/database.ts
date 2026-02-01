import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not defined");
    return;
  }

  try {
    mongoose.set("bufferCommands", false);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error);

    // Retry instead of exit (CRITICAL)
    setTimeout(connectDB, 5000);
  }
};
