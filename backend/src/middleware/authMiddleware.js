import jwt from "jsonwebtoken";

/**
 * PROTECT ROUTE: Verifies the JWT Access Token
 */
export const authenticateToken = (req, res, next) => {
  // Expected Format: "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Attach user info (id and role) to the request
    req.user = user;
    next();
  });
};

/**
 * ROLE CHECK: Restricts routes to Admin only
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access Denied: Admins only" });
  }
};
