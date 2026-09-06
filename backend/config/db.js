import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Call this once when the server starts (in index.js / server.js).
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
}

export default connectDB;