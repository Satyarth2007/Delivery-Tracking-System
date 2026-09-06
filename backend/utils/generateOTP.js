import crypto from "crypto";

/**
 * Generates a numeric OTP (default 6 digits) — used for:
 *  1. Founding dispatcher self-verification at registration
 *  2. Agent account activation (invited by dispatcher)
 *  3. Customer delivery verification (later module)
 *
 * Uses crypto.randomInt for secure randomness (not Math.random,
 * since this guards account access and delivery confirmation).
 *
 * @param {number} digits - length of the OTP (default 6)
 * @param {number} expiryMinutes - how long the OTP stays valid (default 10)
 * @returns {{ otp: string, expiresAt: Date }}
 */
function generateOTP(digits = 6, expiryMinutes = 10) {
  const max = 10 ** digits;
  const otp = crypto.randomInt(0, max).toString().padStart(digits, "0");

  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  return { otp, expiresAt };
}

export default generateOTP;