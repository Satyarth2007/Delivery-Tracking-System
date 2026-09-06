import { redisClient } from "./redisClient.js";

const REFRESH_PREFIX = "refreshToken:";
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days, matches JWT expiry

/**
 * Stores the current valid refresh token for a user. Overwrites any
 * previous one — meaning only one active session per user at a time.
 * (If you want multi-device support later, key by userId+deviceId instead.)
 */
async function storeRefreshToken(userId, token) {
  await redisClient.set(`${REFRESH_PREFIX}${userId}`, token, {
    EX: REFRESH_TTL_SECONDS,
  });
}

async function getRefreshToken(userId) {
  return redisClient.get(`${REFRESH_PREFIX}${userId}`);
}

async function deleteRefreshToken(userId) {
  await redisClient.del(`${REFRESH_PREFIX}${userId}`);
}

export { storeRefreshToken, getRefreshToken, deleteRefreshToken };