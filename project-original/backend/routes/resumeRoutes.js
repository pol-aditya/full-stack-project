const express = require("express");
const router = express.Router();

const { analyzeResume } = require("../controllers/resumeController");

router.get("/resume-analyze", analyzeResume);

module.exports = router;

