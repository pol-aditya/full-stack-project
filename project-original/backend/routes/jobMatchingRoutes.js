const express = require("express");
const router = express.Router();
const { matchJobWithResume, getJobRecommendations } = require("../controllers/jobMatchingController");

// Match specific job with resume
router.post("/match-job", matchJobWithResume);

// Get personalized job recommendations
router.post("/job-recommendations", getJobRecommendations);

module.exports = router;