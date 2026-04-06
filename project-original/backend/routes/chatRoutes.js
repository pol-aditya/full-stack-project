const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/chatController");

// POST request for asking questions
router.post("/chat", chat);

module.exports = router;