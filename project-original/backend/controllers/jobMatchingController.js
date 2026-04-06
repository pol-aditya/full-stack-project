const Resume = require("../models/Resume");
const Job = require("../models/Job");
const askGemini = require("../mcp/geminiService");

// Calculate match score between resume and job
async function matchJobWithResume(req, res) {
  try {
    const { jobId, userId } = req.body;
    
    // Get latest resume
    const resume = await Resume.findOne({ userId }).sort({ uploadedAt: -1 });
    if (!resume) {
      return res.json({
        success: false,
        message: "No resume found. Please upload a resume first."
      });
    }

    // Get job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.json({
        success: false,
        message: "Job not found"
      });
    }

    // Calculate match score using Gemini
    const matchPrompt = `
Compare this resume with the job description and return ONLY valid JSON:
{
  "matchScore": 0-100,
  "matchPercentage": 0-100,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "verdict": "perfect fit|strong match|good match|moderate match|weak match"
}

RESUME DATA:
Skills: ${resume.extractedData?.skills?.join(", ") || "Not found"}
Experience: ${resume.extractedData?.experience?.map(e => `${e.title} at ${e.company}`).join("; ") || "Not found"}
Education: ${resume.extractedData?.education?.map(e => `${e.degree} from ${e.school}`).join("; ") || "Not found"}

JOB DESCRIPTION:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Requirements: ${job.requirements}
`;

    const matchRaw = await askGemini(matchPrompt, "");
    let matchData = {};
    
    try {
      const jsonMatch = matchRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        matchData = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.log("Parse error:", err.message);
      matchData = {
        matchScore: 50,
        matchPercentage: 50,
        matchedSkills: [],
        missingSkills: [],
        strengths: [],
        improvements: [],
        verdict: "moderate match"
      };
    }

    res.json({
      success: true,
      data: {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        matchScore: matchData.matchScore || 50,
        matchPercentage: matchData.matchPercentage || 50,
        matchedSkills: matchData.matchedSkills || [],
        missingSkills: matchData.missingSkills || [],
        strengths: matchData.strengths || [],
        improvements: matchData.improvements || [],
        verdict: matchData.verdict || "moderate match"
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// Get personalized job recommendations
async function getJobRecommendations(req, res) {
  try {
    const { userId, limit = 10 } = req.body;

    // Get latest resume
    const resume = await Resume.findOne({ userId }).sort({ uploadedAt: -1 });
    if (!resume) {
      return res.json({
        success: false,
        message: "No resume found"
      });
    }

    const skills = resume.extractedData?.skills || [];
    const experience = resume.extractedData?.experience || [];

    // Find jobs that match skills
    let recommendedJobs = [];
    const allJobs = await Job.find().limit(limit * 2);

    for (const job of allJobs) {
      const jobText = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();
      const matchedSkills = skills.filter(skill => 
        jobText.includes(skill.toLowerCase())
      );

      if (matchedSkills.length > 0) {
        recommendedJobs.push({
          jobId: job._id,
          title: job.title,
          company: job.company,
          matchedSkillsCount: matchedSkills.length,
          matchedSkills: matchedSkills
        });
      }
    }

    // Sort by matched skills
    recommendedJobs = recommendedJobs
      .sort((a, b) => b.matchedSkillsCount - a.matchedSkillsCount)
      .slice(0, limit);

    res.json({
      success: true,
      data: {
        recommendations: recommendedJobs,
        totalFound: recommendedJobs.length,
        skillsUsed: skills.slice(0, 5)
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

module.exports = {
  matchJobWithResume,
  getJobRecommendations
};