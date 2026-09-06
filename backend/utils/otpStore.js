import { redisClient } from "./redisClient.js";
import generateOTP from "./generateOTP.js";

const OTP_PREFIX = "otp:activation:";
const RESEND_COOLDOWN_PREFIX = "otp:cooldown:";
const RESEND_COUNT_PREFIX = "otp:resend-count:";
const VERIFY_ATTEMPTS_PREFIX = "otp:verify-attempts:";

const RESEND_COOLDOWN_SECONDS = 60;       // wait between resends
const MAX_RESENDS_PER_WINDOW = 5;         // max resends allowed
const RESEND_WINDOW_SECONDS = 60 * 60;    // within 1 hour
const MAX_VERIFY_ATTEMPTS = 5;            // max wrong OTP tries allowed
const VERIFY_LOCKOUT_SECONDS = 15 * 60;   // lock for 15 min after too many tries

/**
 * Generates an OTP, stores it in Redis against the given userId.
 * Redis TTL automatically expires the OTP after `expiryMinutes`.
 */
async function createAndStoreOTP(userId, expiryMinutes = 10) {
  const { otp } = generateOTP(6, expiryMinutes);

  await redisClient.set(`${OTP_PREFIX}${userId}`, otp, {
    EX: expiryMinutes * 60,
  });

  return otp;
}

/**
 * Verifies OTP, with brute-force protection: after MAX_VERIFY_ATTEMPTS
 * wrong tries, the user is locked out for VERIFY_LOCKOUT_SECONDS.
 */
async function verifyOTP(userId, enteredOtp) {
  const attemptsKey = `${VERIFY_ATTEMPTS_PREFIX}${userId}`;
  const attempts = parseInt((await redisClient.get(attemptsKey)) || "0", 10);

  if (attempts >= MAX_VERIFY_ATTEMPTS) {
    const ttl = await redisClient.ttl(attemptsKey);
    return { success: false, lockedOut: true, retryAfterSeconds: ttl };
  }

  const otpKey = `${OTP_PREFIX}${userId}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== enteredOtp) {
    const newCount = attempts + 1;
    await redisClient.set(attemptsKey, newCount.toString(), {
      EX: VERIFY_LOCKOUT_SECONDS,
    });
    return {
      success: false,
      lockedOut: false,
      attemptsRemaining: MAX_VERIFY_ATTEMPTS - newCount,
    };
  }

  // Success — clear both OTP and attempt counter
  await redisClient.del(otpKey);
  await redisClient.del(attemptsKey);
  return { success: true };
}

/**
 * Resends OTP with two safeguards:
 *  1. Cooldown — can't resend within RESEND_COOLDOWN_SECONDS
 *  2. Max count — can't resend more than MAX_RESENDS_PER_WINDOW within
 *     RESEND_WINDOW_SECONDS
 */
async function resendOTP(userId, expiryMinutes = 10) {
  const cooldownKey = `${RESEND_COOLDOWN_PREFIX}${userId}`;
  const countKey = `${RESEND_COUNT_PREFIX}${userId}`;

  const cooldownActive = await redisClient.get(cooldownKey);
  if (cooldownActive) {
    const ttl = await redisClient.ttl(cooldownKey);
    return { success: false, reason: "cooldown", retryAfterSeconds: ttl };
  }

  const resendCount = parseInt((await redisClient.get(countKey)) || "0", 10);
  if (resendCount >= MAX_RESENDS_PER_WINDOW) {
    const ttl = await redisClient.ttl(countKey);
    return { success: false, reason: "max_attempts", retryAfterSeconds: ttl };
  }

  const otp = await createAndStoreOTP(userId, expiryMinutes);

  await redisClient.set(cooldownKey, "1", { EX: RESEND_COOLDOWN_SECONDS });

  if (resendCount === 0) {
    await redisClient.set(countKey, "1", { EX: RESEND_WINDOW_SECONDS });
  } else {
    await redisClient.incr(countKey);
  }

  return { success: true, otp };
}

export { createAndStoreOTP, verifyOTP, resendOTP };