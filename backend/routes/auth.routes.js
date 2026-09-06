import express from "express";
import { register, verifyOwner, resendOtpController, login } from "../controller/auth.controller.js";
import { registerLimiter, loginLimiter, otpRouteLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/verify-owner", otpRouteLimiter, verifyOwner);
router.post("/resend-otp", otpRouteLimiter, resendOtpController);
router.post("/login", loginLimiter, login);

export default router;