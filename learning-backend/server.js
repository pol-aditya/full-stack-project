const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectMongo = require("./config/db");
const mysqlDB = require("./config/mysql");
const userRoutes = require("./routes/userRoutes.js");
const resumeRoutes = require("./routes/resumeRoutes.js");
const recruiterRoutes = require("./routes/recruiterRoutes.js");
const jobsRoutes = require("./routes/jobsRoutes.js");
const { ensureCoreTables } = require("./config/dbInit");

connectMongo();
ensureCoreTables()
  .then(() => {
    console.log("MySQL core tables ensured ✅");
  })
  .catch((error) => {
    console.error("Failed to ensure MySQL core tables:", error.message || error);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes);
app.use("/api", resumeRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api", jobsRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "File too large. Maximum allowed size is 10MB." });
  }

  if (req.originalUrl && req.originalUrl.startsWith("/api")) {
    return res.status(err?.status || 500).json({ message: err?.message || "Internal server error" });
  }

  return next(err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});