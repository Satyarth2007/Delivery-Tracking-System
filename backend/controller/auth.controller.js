import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";
import generateUserId from "../utils/generateUserId.js";
import { createAndStoreOTP, verifyOTP, resendOTP } from "../utils/otpStore.js";
import { sendSMS } from "../services/smsService.js";

/**
 * POST /api/auth/register
 * Registers the founding dispatcher + creates their Company.
 */
async function register(req, res) {
  try {
    const { companyName, name, email, phone, password } = req.body;

    if (!companyName || !name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if this email/phone is already used in ANY pending/active state
    // for a company they'd be founding (email/phone + companyId uniqueness
    // only makes sense once companyId exists, so we check broadly here
    // to avoid orphaned duplicate founder accounts).
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Create Company first (pending_review by default)
    const company = await Company.create({
      name: companyName,
      ownerId: null, // will be set after User is created
    });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique human-readable userId
    const userId = await generateUserId();

    // Create founding dispatcher User
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

    // Link company back to its owner
    company.ownerId = user._id;
    await company.save();

    // Generate and send OTP
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
 * Verifies the OTP and activates the founding dispatcher's account.
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

    // Issue JWT
    const token = jwt.sign(
      { userId: user.userId, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Account activated successfully.",
      token,
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

    const token = jwt.sign(
      { userId: user.userId, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
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

export { register, verifyOwner, resendOtpController, login };