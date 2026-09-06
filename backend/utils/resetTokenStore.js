import { redisClient } from "./redisClient.js";
import generateActivationToken from "./generateActivationToken.js";

const RESET_PREFIX = "resetToken:";
const RESEND_COOLDOWN_PREFIX = "resetCooldown:";
const RESEND_COOLDOWN_SECONDS = 60;

async function createAndStoreResetToken(userId, expiryMinutes = 30) {
  const { token } = generateActivationToken(expiryMinutes);

  await redisClient.set(`${RESET_PREFIX}${userId}`, token, {
    EX: expiryMinutes * 60,
  });

  return token;
}

async function verifyResetToken(userId, token) {
  const storedToken = await redisClient.get(`${RESET_PREFIX}${userId}`);
  return storedToken && storedToken === token;
}

async function deleteResetToken(userId) {
  await redisClient.del(`${RESET_PREFIX}${userId}`);
}

async function canRequestReset(userId) {
  const cooldownKey = `${RESEND_COOLDOWN_PREFIX}${userId}`;
  const active = await redisClient.get(cooldownKey);
  if (active) {
    const ttl = await redisClient.ttl(cooldownKey);
    return { allowed: false, retryAfterSeconds: ttl };
  }
  await redisClient.set(cooldownKey, "1", { EX: RESEND_COOLDOWN_SECONDS });
  return { allowed: true };
}

export { createAndStoreResetToken, verifyResetToken, deleteResetToken, canRequestReset };