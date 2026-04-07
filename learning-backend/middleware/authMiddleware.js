const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ❌ No token
  if (!authHeader) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, "secretkey123");

    // Attach user info to request
    req.user = decoded;

    next(); // move to next step
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;