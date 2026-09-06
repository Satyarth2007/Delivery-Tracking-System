import rateLimit from "express-rate-limit";

// General login attempts — prevents password brute-forcing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per IP in that window
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration — prevents spam account creation
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // max 5 registrations per IP per hour
  message: {
    message: "Too many registration attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP-related routes (verify/resend) — extra IP-level layer on top
// of the Redis per-user limits in otpStore.js
const otpRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 OTP-related requests per IP
  message: {
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { loginLimiter, registerLimiter, otpRouteLimiter };