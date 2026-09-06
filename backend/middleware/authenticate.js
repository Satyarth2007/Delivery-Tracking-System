import jwt from "jsonwebtoken";

/**
 * Verifies the access token from the Authorization header.
 * Attaches decoded payload (userId, role, companyId) to req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No access token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // { userId, role, companyId }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired.", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "Invalid access token." });
  }
}

export default authenticate;