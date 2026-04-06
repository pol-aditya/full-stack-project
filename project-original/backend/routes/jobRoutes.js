const express = require("express");
const router = express.Router();

const { recommendJobs } = require("../controllers/jobController");

router.get("/job-match", recommendJobs);

module.exports = router;