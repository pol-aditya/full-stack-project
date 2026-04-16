const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/mysql");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { ensureJobPortalTables } = require("../config/dbInit");

const router = express.Router();

const queryAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });

const ensureRecruiterTables = ensureJobPortalTables;

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev_jwt_secret",
    { expiresIn: "12h" }
  );

router.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  try {
    await ensureRecruiterTables();
    const existing = await queryAsync("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(409).json({ message: "Recruiter with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insert = await queryAsync(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "recruiter"]
    );

    const recruiter = {
      id: insert.insertId,
      name,
      email,
      role: "recruiter",
    };

    return res.status(201).json({
      message: "Recruiter registered successfully",
      token: signToken(recruiter),
      user: recruiter,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to register recruiter" });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    await ensureRecruiterTables();
    const rows = await queryAsync("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const user = rows[0];
    if (user.role !== "recruiter") {
      return res.status(403).json({ message: "This login is only for recruiters" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.json({
      message: "Recruiter login successful",
      token: signToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to login recruiter" });
  }
});

router.post("/jobs", protect, requireRole(["recruiter"]), async (req, res) => {
  const {
    title,
    company,
    location,
    jobType,
    experienceLevel,
    salaryRange = "",
    skillsRequired = "",
    description,
    applicationDeadline = null,
  } = req.body || {};

  if (!title || !company || !location || !jobType || !experienceLevel || !description) {
    return res.status(400).json({
      message: "title, company, location, jobType, experienceLevel, and description are required",
    });
  }

  try {
    await ensureRecruiterTables();

    const insert = await queryAsync(
      `
        INSERT INTO job_posts (
          recruiter_id, title, company, location, job_type, experience_level,
          salary_range, skills_required, description, application_deadline, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        title,
        company,
        location,
        jobType,
        experienceLevel,
        salaryRange,
        skillsRequired,
        description,
        applicationDeadline,
        "open",
      ]
    );

    return res.status(201).json({
      message: "Job posted successfully",
      data: {
        id: insert.insertId,
        recruiterId: req.user.id,
        title,
        company,
        location,
        jobType,
        experienceLevel,
        salaryRange,
        skillsRequired,
        description,
        applicationDeadline,
        status: "open",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to post job" });
  }
});

router.get("/jobs", protect, requireRole(["recruiter"]), async (req, res) => {
  try {
    await ensureRecruiterTables();

    const rows = await queryAsync(
      `
        SELECT
          jp.id,
          jp.title,
          jp.company,
          jp.location,
          jp.job_type,
          jp.experience_level,
          jp.salary_range,
          jp.skills_required,
          jp.description,
          jp.application_deadline,
          jp.status,
          jp.created_at,
          COUNT(ja.id) AS application_count
        FROM job_posts jp
        LEFT JOIN job_applications ja ON ja.job_id = jp.id
        WHERE jp.recruiter_id = ?
        GROUP BY jp.id
        ORDER BY jp.created_at DESC
      `,
      [req.user.id]
    );

    return res.json({
      message: "Recruiter jobs loaded",
      data: rows.map((row) => ({
        id: row.id,
        title: row.title,
        company: row.company,
        location: row.location,
        jobType: row.job_type,
        experienceLevel: row.experience_level,
        salaryRange: row.salary_range,
        skillsRequired: row.skills_required,
        description: row.description,
        applicationDeadline: row.application_deadline,
        status: row.status,
        createdAt: row.created_at,
        applicationCount: Number(row.application_count || 0),
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load recruiter jobs" });
  }
});

router.get("/jobs/:jobId/applications", protect, requireRole(["recruiter"]), async (req, res) => {
  const { jobId } = req.params;

  try {
    await ensureRecruiterTables();

    const owner = await queryAsync("SELECT recruiter_id FROM job_posts WHERE id = ? LIMIT 1", [jobId]);
    if (!Array.isArray(owner) || owner.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (Number(owner[0].recruiter_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: "You can only view applications to your jobs" });
    }

    const rows = await queryAsync(
      `
        SELECT id, job_id, applicant_id, full_name, email, phone, resume_link, cover_letter, status, created_at
        FROM job_applications
        WHERE job_id = ?
        ORDER BY created_at DESC
      `,
      [jobId]
    );

    return res.json({
      message: "Applications loaded",
      data: rows.map((row) => ({
        id: row.id,
        jobId: row.job_id,
        applicantId: row.applicant_id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        resumeLink: row.resume_link,
        coverLetter: row.cover_letter,
        status: row.status,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load applications" });
  }
});

module.exports = router;
