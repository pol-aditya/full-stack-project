const express = require("express");
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

const ensureJobsTables = ensureJobPortalTables;

router.get("/jobs", async (req, res) => {
  try {
    await ensureJobsTables();

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
          u.name AS recruiter_name
        FROM job_posts jp
        LEFT JOIN users u ON u.id = jp.recruiter_id
        WHERE jp.status = 'open'
        ORDER BY jp.created_at DESC
      `
    );

    return res.json({
      message: "Open jobs loaded",
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
        recruiterName: row.recruiter_name,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load jobs" });
  }
});

router.get("/jobs/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    await ensureJobsTables();

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
          u.name AS recruiter_name
        FROM job_posts jp
        LEFT JOIN users u ON u.id = jp.recruiter_id
        WHERE jp.id = ?
        LIMIT 1
      `,
      [jobId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const row = rows[0];
    return res.json({
      message: "Job loaded",
      data: {
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
        recruiterName: row.recruiter_name,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load job" });
  }
});

router.post("/jobs/:jobId/apply", protect, requireRole(["employee", "candidate", "user"]), async (req, res) => {
  const { jobId } = req.params;
  const { fullName, email, phone = "", resumeLink = "", coverLetter = "" } = req.body || {};

  if (!fullName || !email) {
    return res.status(400).json({ message: "fullName and email are required" });
  }

  try {
    await ensureJobsTables();

    const jobs = await queryAsync("SELECT id, status FROM job_posts WHERE id = ? LIMIT 1", [jobId]);
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (jobs[0].status !== "open") {
      return res.status(400).json({ message: "This job is not accepting applications" });
    }

    const existing = await queryAsync(
      "SELECT id FROM job_applications WHERE job_id = ? AND applicant_id = ? LIMIT 1",
      [jobId, req.user.id]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }

    const insert = await queryAsync(
      `
        INSERT INTO job_applications (job_id, applicant_id, full_name, email, phone, resume_link, cover_letter, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [jobId, req.user.id, fullName, email, phone, resumeLink, coverLetter, "submitted"]
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      data: {
        id: insert.insertId,
        jobId: Number(jobId),
        applicantId: req.user.id,
        fullName,
        email,
        phone,
        resumeLink,
        coverLetter,
        status: "submitted",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to apply for job" });
  }
});

module.exports = router;
