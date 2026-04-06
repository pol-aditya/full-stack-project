const express = require("express");
const router = express.Router();
const multer = require("multer");

const { analyzeResume } = require("../controllers/resumeAnalyzerController");

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, "uploads/");
 },
 filename: function (req, file, cb) {
  cb(null, Date.now() + "-" + file.originalname);
 }
});

const upload = multer({ storage });

router.post("/analyze-resume", upload.any(), analyzeResume);

module.exports = router;