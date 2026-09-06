import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import { connectRedis } from "./utils/redisClient.js";

const app = express();

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  // Connect to Redis (Upstash)
  await connectRedis();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();