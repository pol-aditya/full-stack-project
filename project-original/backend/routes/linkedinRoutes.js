const express = require("express");
const router = express.Router();

const { extractJob } = require("../controllers/linkedinController");

router.post("/parse-linkedin-job", extractJob);

module.exports = router;