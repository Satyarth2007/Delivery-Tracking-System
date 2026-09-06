import express from "express";
import {
  inviteAgent,
  activateAgent,
  resendAgentInvite,
  listAgents,
  deactivateAgent,
  reactivateAgent,
} from "../controller/agent.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import scopeToCompany from "../middleware/scopeToCompany.js";
import requireApprovedCompany from "../middleware/requireApprovedCompany.js";
import { otpRouteLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public-ish (agent uses this without being logged in yet)
router.post("/activate", otpRouteLimiter, activateAgent);

// Dispatcher-only, requires approved company
router.post(
  "/invite",
  authenticate,
  authorize("dispatcher"),
  scopeToCompany,
  requireApprovedCompany,
  inviteAgent
);

router.post(
  "/resend-invite",
  authenticate,
  authorize("dispatcher"),
  scopeToCompany,
  otpRouteLimiter,
  resendAgentInvite
);

router.get("/", authenticate, authorize("dispatcher"), scopeToCompany, listAgents);

router.patch(
  "/:userId/deactivate",
  authenticate,
  authorize("dispatcher"),
  scopeToCompany,
  deactivateAgent
);

router.patch(
  "/:userId/reactivate",
  authenticate,
  authorize("dispatcher"),
  scopeToCompany,
  reactivateAgent
);

export default router;