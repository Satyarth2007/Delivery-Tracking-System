import express from "express";
import { listCompanies, approveCompany, rejectCompany } from "../controller/admin.controller.js";
import authenticate from "../middleware/authenticate.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// All admin routes require valid login + admin check
router.use(authenticate, isAdmin);

router.get("/companies", listCompanies);
router.patch("/companies/:id/approve", approveCompany);
router.patch("/companies/:id/reject", rejectCompany);

export default router;