import Company from "../models/Company.js";

/**
 * GET /api/admin/companies?status=pending_review
 * Lists companies filtered by status (defaults to pending_review).
 */
async function listCompanies(req, res) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : { status: "pending_review" };

    const companies = await Company.find(filter)
      .populate("ownerId", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({ companies });
  } catch (error) {
    console.error("List companies error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * PATCH /api/admin/companies/:id/approve
 */
async function approveCompany(req, res) {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    company.status = "approved";
    company.reviewedAt = new Date();
    company.reviewedBy = req.user.email;
    company.rejectionReason = null;
    await company.save();

    return res.status(200).json({ message: "Company approved.", company });
  } catch (error) {
    console.error("Approve company error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * PATCH /api/admin/companies/:id/reject
 */
async function rejectCompany(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    company.status = "rejected";
    company.reviewedAt = new Date();
    company.reviewedBy = req.user.email;
    company.rejectionReason = reason || "Not specified.";
    await company.save();

    return res.status(200).json({ message: "Company rejected.", company });
  } catch (error) {
    console.error("Reject company error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export { listCompanies, approveCompany, rejectCompany };