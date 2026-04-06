const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  skills: [String],
  experience: String,
  description: String
});

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);