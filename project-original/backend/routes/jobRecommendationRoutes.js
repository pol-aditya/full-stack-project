const express = require("express");
const router = express.Router();

const { recommendJobs } = require("../controllers/jobRecommendationController");

router.post("/recommend-jobs", recommendJobs);

module.exports = router;