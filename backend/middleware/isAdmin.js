/**
 * Simple admin check — compares the authenticated user's email against
 * a single admin email defined in environment variables. No separate
 * Admin model needed at this scale (solo-founder / small team).
 */
async function isAdmin(req, res, next) {
  if (!req.user || req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}

export default isAdmin;