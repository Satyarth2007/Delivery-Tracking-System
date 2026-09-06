import jwt from "jsonwebtoken";

/**
 * Access token — short-lived, sent in response body, used in the
 * Authorization header for every API call.
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

/**
 * Refresh token — longer-lived, stored as an httpOnly cookie, used
 * only to obtain a new access token via /api/auth/refresh-token.
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export { generateAccessToken, generateRefreshToken };