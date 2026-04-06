const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: String,
  name: String,
  filename: String,
  filepath: String,
  rawText: String,
  
  // Extracted Information
  extractedData: {
    fullName: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      school: String,
      year: String,
      details: String
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String]
    }],
    summary: String
  },
  
  // Analysis Results
  atsScore: {
    score: Number,
    percentage: Number,
    feedback: [String],
    suggestions: [String]
  },
  
  keywordAnalysis: {
    presentKeywords: [String],
    missingKeywords: [String],
    keywordDensity: Object
  },
  
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  analyzedAt: Date,
  status: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  }
});

module.exports = mongoose.model("Resume", resumeSchema);