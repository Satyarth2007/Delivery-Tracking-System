import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateUserId from "../utils/generateUserId.js";
import { createAndStoreOTP, verifyOTP, resendOTP } from "../utils/otpStore.js";
import { sendSMS } from "../services/smsService.js";

/**
 * POST /api/v1/agents/invite
 * Dispatcher adds a new agent under their company.
 */
async function inviteAgent(req, res) {
  try {
    const { name, phone, email } = req.body;
    const dispatcherId = req.user.userId; // human-readable userId from JWT
    const companyId = req.user.companyId;

    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Name, phone, and email are required." });
    }

    // Check for existing user with same email OR phone in this company
    const existingUser = await User.findOne({
      companyId,
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      if (existingUser.status === "active") {
        return res.status(409).json({ message: "This person is already an active agent in your company." });
      }

      if (existingUser.status === "pending") {
        // Don't create a duplicate — trigger a resend instead
        const result = await resendOTP(existingUser.userId);

        if (!result.success) {
          return res.status(429).json({
            message:
              result.reason === "cooldown"
                ? `Please wait ${result.retryAfterSeconds} seconds before resending.`
                : `Maximum resend attempts reached. Try again in ${result.retryAfterSeconds} seconds.`,
          });
        }

        await sendSMS(existingUser.phone, `Your activation OTP is ${result.otp}. Valid for 10 minutes.`);

        return res.status(200).json({
          message: "This agent already has a pending invite. Activation OTP resent.",
          userId: existingUser.userId,
        });
      }

      if (existingUser.status === "deactivated") {
        return res.status(409).json({
          message: "This person was previously deactivated. Please reactivate instead of re-inviting.",
        });
      }
    }

    // Find the actual dispatcher's Mongo _id for createdBy reference
    const dispatcher = await User.findOne({ userId: dispatcherId });

    const userId = await generateUserId();

    const newAgent = await User.create({
      userId,
      name,
      email: email.toLowerCase(),
      phone,
      role: "agent",
      companyId,
      createdBy: dispatcher._id,
      status: "pending",
      invitedAt: new Date(),
    });

    const otp = await createAndStoreOTP(newAgent.userId);
    await sendSMS(phone, `You've been invited as a delivery agent. Your activation OTP is ${otp}. Valid for 10 minutes.`);

    return res.status(201).json({
      message: "Agent invited successfully. Activation OTP sent.",
      userId: newAgent.userId,
    });
  } catch (error) {
    console.error("Invite agent error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/v1/agents/activate
 * Agent verifies OTP and sets their password.
 */
async function activateAgent(req, res) {
  try {
    const { userId, otp, password } = req.body;

    if (!userId || !otp || !password) {
      return res.status(400).json({ message: "userId, OTP, and password are required." });
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

    const agent = await User.findOne({ userId, role: "agent" });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found." });
    }

    agent.passwordHash = await bcrypt.hash(password, 10);
    agent.status = "active";
    agent.activatedAt = new Date();
    await agent.save();

    return res.status(200).json({ message: "Account activated successfully. You can now log in." });
  } catch (error) {
    console.error("Activate agent error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * POST /api/v1/agents/resend-invite
 * Dispatcher can manually trigger a resend for a pending agent.
 */
async function resendAgentInvite(req, res) {
  try {
    const { userId } = req.body;
    const companyId = req.user.companyId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const agent = await User.findOne({ userId, role: "agent", companyId });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found in your company." });
    }

    if (agent.status !== "pending") {
      return res.status(400).json({ message: `This agent's account is already ${agent.status}.` });
    }

    const result = await resendOTP(agent.userId);

    if (!result.success) {
      return res.status(429).json({
        message:
          result.reason === "cooldown"
            ? `Please wait ${result.retryAfterSeconds} seconds before resending.`
            : `Maximum resend attempts reached. Try again in ${result.retryAfterSeconds} seconds.`,
      });
    }

    await sendSMS(agent.phone, `Your activation OTP is ${result.otp}. Valid for 10 minutes.`);

    return res.status(200).json({ message: "Invite OTP resent successfully." });
  } catch (error) {
    console.error("Resend agent invite error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

/**
 * GET /api/v1/agents
 * Dispatcher views all agents in their company.
 */
async function listAgents(req, res) {
  try {
    const companyId = req.user.companyId;

    const agents = await User.find({ role: "agent", companyId }).select(
      "userId name email phone status invitedAt activatedAt isActive createdAt"
    );

    return res.status(200).json({ agents });
  } catch (error) {
    console.error("List agents error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * PATCH /api/v1/agents/:userId/deactivate
 */
async function deactivateAgent(req, res) {
  try {
    const { userId } = req.params;
    const companyId = req.user.companyId;

    const agent = await User.findOne({ userId, role: "agent", companyId });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found in your company." });
    }

    agent.status = "deactivated";
    agent.isActive = false;
    await agent.save();

    return res.status(200).json({ message: "Agent deactivated." });
  } catch (error) {
    console.error("Deactivate agent error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * PATCH /api/v1/agents/:userId/reactivate
 */
async function reactivateAgent(req, res) {
  try {
    const { userId } = req.params;
    const companyId = req.user.companyId;

    const agent = await User.findOne({ userId, role: "agent", companyId });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found in your company." });
    }

    if (agent.status !== "deactivated") {
      return res.status(400).json({ message: "Only deactivated agents can be reactivated." });
    }

    agent.status = "active";
    agent.isActive = true;
    await agent.save();

    return res.status(200).json({ message: "Agent reactivated." });
  } catch (error) {
    console.error("Reactivate agent error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export {
  inviteAgent,
  activateAgent,
  resendAgentInvite,
  listAgents,
  deactivateAgent,
  reactivateAgent,
};
