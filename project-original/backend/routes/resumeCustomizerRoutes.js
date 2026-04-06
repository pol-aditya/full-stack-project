const express = require("express");
const router = express.Router();

const { customizeResumeForJob } = require("../controllers/resumeCustomizerController");

router.post("/customize-resume", customizeResumeForJob);

module.exports = router;