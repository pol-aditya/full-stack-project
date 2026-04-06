const Job = require("../models/Job");

async function recommendJobs(req, res) {

 try {

  const skills = req.body.skills;

  const jobs = await Job.find({
   skills: { $in: skills }
  });

  res.json({
   recommended_jobs: jobs
  });

 } catch (err) {
  res.status(500).json({ error: err.message });
 }

}

module.exports = { recommendJobs };