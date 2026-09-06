/**
 * Ensures the authenticated user's companyId is available for filtering
 * queries. Doesn't modify the request body/query itself — controllers
 * should explicitly use req.user.companyId in their DB filters.
 *
 * This middleware mainly guards against missing companyId on the token
 * (defensive check) and can be extended later for stricter enforcement.
 */
function scopeToCompany(req, res, next) {
  if (!req.user || !req.user.companyId) {
    return res.status(403).json({ message: "Company context missing." });
  }
  next();
}

export default scopeToCompany;