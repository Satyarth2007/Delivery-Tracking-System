/**
 * Restricts a route to specific roles.
 * Usage: router.post('/agents/invite', authenticate, authorize('dispatcher'), controller)
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    next();
  };
}

export default authorize;