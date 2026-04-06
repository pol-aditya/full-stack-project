// const express = require("express");
// const app = express();

// const chatRoutes = require("./routes/chatRoutes");
// const resumeRoutes = require("./routes/resumeRoutes");
// const jobRoutes = require("./routes/jobRoutes");
// const quizRoutes = require("./routes/quizRoutes");

// app.use(express.json());

// // API routes
// app.use("/api", chatRoutes);
// app.use("/api", resumeRoutes);
// app.use("/api", jobRoutes);
// app.use("/api", quizRoutes);

// app.get("/", (req, res) => {
//     res.send("Backend is running");
// });

// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });


// const resumeRoutes = require("./routes/resumeRoutes");

// app.use("/api", resumeRoutes);

// const jobRoutes = require("./routes/jobRoutes");

// app.use("/api", jobRoutes);


// const router = express.Router();

// const { generateQuizQuestions } = require("../controllers/quizController");

// router.get("/generate-quiz", generateQuizQuestions);

// module.exports = router;


require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");

const app = express();

// Import all routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resumeGeneratorRoutes = require("./routes/resumeGeneratorRoutes");
const resumeCustomizerRoutes = require("./routes/resumeCustomizerRoutes");
const resumeUploadRoutes = require("./routes/resumeUploadRoutes");
const resumeAnalyzerRoutes = require("./routes/resumeAnalyzerRoutes");
const jobRecommendationRoutes = require("./routes/jobRecommendationRoutes");
const jobMatchingRoutes = require("./routes/jobMatchingRoutes");
const atsRoutes = require("./routes/atsRoutes");
const linkedinRoutes = require("./routes/linkedinRoutes");

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Register all routes BEFORE app.listen()
app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", resumeRoutes);
app.use("/api", jobRoutes);
app.use("/api", quizRoutes);
app.use("/api", resumeGeneratorRoutes);
app.use("/api", resumeCustomizerRoutes);
app.use("/api", resumeUploadRoutes);
app.use("/api", resumeAnalyzerRoutes);
app.use("/api", jobRecommendationRoutes);
app.use("/api", jobMatchingRoutes);
app.use("/api", atsRoutes);
app.use("/api", linkedinRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});