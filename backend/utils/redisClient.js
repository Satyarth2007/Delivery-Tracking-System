import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export { redisClient, connectRedis };