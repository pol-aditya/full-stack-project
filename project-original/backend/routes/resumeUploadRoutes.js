const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadResume, getResumeAnalysis } = require("../controllers/resumeUploadController");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload and analyze resume
router.post("/upload-resume", upload.single("resume"), uploadResume);

// Get resume analysis
router.post("/resume-analysis", getResumeAnalysis);
router.get("/resume-analysis", getResumeAnalysis);

module.exports = router;