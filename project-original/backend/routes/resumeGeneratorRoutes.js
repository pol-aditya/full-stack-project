const express = require("express");
const router = express.Router();

const { createResume } = require("../controllers/resumeGeneratorController");

router.post("/generate-resume", createResume);

module.exports = router;