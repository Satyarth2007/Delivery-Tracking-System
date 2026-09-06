import Company from "../models/Company.js";

/**
 * Blocks actions (like inviting agents, creating delivery lists) until
 * the dispatcher's company has been approved by an admin.
 */
async function requireApprovedCompany(req, res, next) {
  try {
    const company = await Company.findById(req.user.companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    if (company.status !== "approved") {
      return res.status(403).json({
        message: `Your company is currently ${company.status}. Full access is granted after admin approval.`,
      });
    }

    next();
  } catch (error) {
    console.error("requireApprovedCompany error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export default requireApprovedCompany;