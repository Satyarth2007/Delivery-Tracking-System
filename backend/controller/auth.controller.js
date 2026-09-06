import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Company from "../models/Company.js";
import generateUserId from "../utils/generateUserId.js";
import { createAndStoreOTP, verifyOTP, resendOTP } from "../utils/otpStore.js";
import { sendSMS } from "../services/smsService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} from "../utils/refreshTokenStore.js";
import jwt from "jsonwebtoken";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Helper: issues both tokens, stores refresh token in Redis, and
 * sets it as an httpOnly cookie on the response.
 */
async function issueTokens(res, user) {
  const payload = { userId: user.userId, role: user.role, companyId: user.companyId };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await storeRefreshToken(user.userId, refreshToken);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return accessToken;
}

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { companyName, name, email, phone, password } = req.body;

    if (!companyName || !name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const company = await Company.create({ name: companyName, ownerId: null });

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await generateUserId();

    const user = await User.create({
      userId,
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: "dispatcher",
      companyId: company._id,
      createdBy: null,
      status: "pending",
    });

    company.ownerId = user._id;
    await company.save();

    const otp = await createAndStoreOTP(user.userId);
    await sendSMS(phone, `Your verification OTP is ${otp}. Valid for 10 minutes.`);

    return res.status(201).json({
      message: "Registration successful. Please verify the OTP sent to your phone.",
      userId: user.userId,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/auth/verify-owner
 */
async function verifyOwner(req, res) {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "userId and OTP are required." });
    }

    const result = await verifyOTP(userId, otp);

    if (!result.success) {
      if (result.lockedOut) {
        return res.status(429).json({
          message: `Too many failed attempts. Try again in ${result.retryAfterSeconds} seconds.`,
        });
      }
      return res.status(400).json({
        message: "Invalid OTP.",
        attemptsRemaining: result.attemptsRemaining,
      });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.status = "active";
    user.activatedAt = new Date();
    await user.save();

    const accessToken = await issueTokens(res, user);

    return res.status(200).json({
      message: "Account activated successfully.",
      accessToken,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    console.error("Verify owner error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/auth/resend-otp
 */
async function resendOtpController(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const result = await resendOTP(user.userId);

    if (!result.success) {
      return res.status(429).json({
        message:
          result.reason === "cooldown"
            ? `Please wait ${result.retryAfterSeconds} seconds before requesting again.`
            : `Maximum resend attempts reached. Try again in ${result.retryAfterSeconds} seconds.`,
      });
    }

    await sendSMS(user.phone, `Your verification OTP is ${result.otp}. Valid for 10 minutes.`);

    return res.status(200).json({ message: "OTP resent successfully." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: `Account is ${user.status}. Please complete activation.` });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const accessToken = await issueTokens(res, user);

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/auth/refresh-token
 * Reads the refresh token from the httpOnly cookie, validates it against
 * both its signature AND what's stored in Redis, issues a new access token.
 */
async function refreshTokenController(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token." });
    }

    const storedToken = await getRefreshToken(decoded.userId);
    if (!storedToken || storedToken !== token) {
      // Token was revoked (logout) or superseded by a newer login
      return res.status(401).json({ message: "Refresh token no longer valid. Please log in again." });
    }

    const user = await User.findOne({ userId: decoded.userId });
    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Account is not active." });
    }

    const accessToken = generateAccessToken({
      userId: user.userId,
      role: user.role,
      companyId: user.companyId,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/auth/logout
 * Deletes the refresh token from Redis (revokes the session) and clears
 * the cookie.
 */
async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await deleteRefreshToken(decoded.userId);
      } catch {
        // Token already invalid/expired — nothing to revoke, proceed anyway
      }
    }

    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export {
  register,
  verifyOwner,
  resendOtpController,
  login,
  refreshTokenController,
  logout,
};