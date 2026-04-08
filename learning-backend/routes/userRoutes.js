const express = require("express");
const router = express.Router();

// ✅ IMPORTS FIRST
const protect = require("../middleware/authMiddleware");
const { registerUser, getTestUser, loginUser } = require("../controllers/userController");

// ✅ ROUTES
router.get("/test", getTestUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ PROTECTED ROUTE
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed ✅",
    user: req.user,
  });
});

// ✅ EXPORT LAST
module.exports = router;