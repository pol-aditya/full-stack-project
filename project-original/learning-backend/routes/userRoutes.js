// const express = require("express");
// const router = express.Router();

// router.get("/test", (req, res) => {
//   res.send("User route working");
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const { getTestUser } = require("../controllers/userController");

// 👇 THIS MUST MATCH
router.get("/test", getTestUser);

module.exports = router;

console.log("userRoutes file loaded");

router.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.send("User controller working");
});

