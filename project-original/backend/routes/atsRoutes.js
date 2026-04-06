const express = require("express");
const router = express.Router();

const { analyzeResumeATS } = require("../controllers/atsController");

router.get("/ats-score", analyzeResumeATS);

module.exports = router;