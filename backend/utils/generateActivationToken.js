import crypto from "crypto";

/**
 * Generates a cryptographically secure activation token — used ONLY for
 * the forgot-password reset-link flow (sent via email).
 *
 * NOT used for account activation (dispatcher/agent) — that flow uses
 * generateOTP.js instead, since it's SMS-based.
 *
 * @param {number} expiryMinutes - how long the token stays valid (default 30)
 * @returns {{ token: string, expiresAt: Date }}
 */
function generateActivationToken(expiryMinutes = 10) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  return { token, expiresAt };
}

export default generateActivationToken;