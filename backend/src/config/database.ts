import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/ChatBubble";

export const connectDB = async () => {

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not defined");
    return;
  }

  try {
    mongoose.set("bufferCommands", false);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error);

    // Retry instead of exit (CRITICAL)
    setTimeout(connectDB, 5000);
  }
};
