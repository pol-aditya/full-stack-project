const askGemini = require("./geminiService");

const ATS_KEYWORDS = [
  "skills", "experience", "education", "project", "achievement",
  "responsibility", "leadership", "technical", "software", "development",
  "analysis", "communication", "teamwork", "problem", "solution"
];

async function calculateATSScore(resumeText, extractedData) {
  try {
    const errors = [];
    const suggestions = [];
    let score = 100;

    // Check 1: Resume length (ideal: 400-800 words)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 200) {
      errors.push("Resume is too short. Add more details about experience and skills.");
      score -= 15;
    } else if (wordCount > 1200) {
      suggestions.push("Resume is quite long. Consider condensing to one page.");
      score -= 5;
    }

    // Check 2: Section presence
    const text = resumeText.toLowerCase();
    const hasSummary = text.includes("summary") || text.includes("objective");
    const hasExperience = text.includes("experience") || text.includes("work history");
    const hasEducation = text.includes("education") || text.includes("degree");
    const hasSkills = text.includes("skills") || text.includes("technical");

    if (!hasSummary) {
      suggestions.push("Add a professional summary or objective section.");
      score -= 5;
    }
    if (!hasExperience) {
      errors.push("No work experience section found.");
      score -= 20;
    }
    if (!hasEducation) {
      errors.push("No education section found.");
      score -= 15;
    }
    if (!hasSkills) {
      errors.push("No skills section found.");
      score -= 15;
    }

    // Check 3: Keyword presence
    const presentKeywords = ATS_KEYWORDS.filter(kw => 
      text.includes(kw.toLowerCase())
    );
    
    if (presentKeywords.length < 5) {
      suggestions.push(`Add industry-relevant keywords. Currently has ${presentKeywords.length}/15 common ATS keywords.`);
      score -= (15 - presentKeywords.length) * 2;
    }

    // Check 4: Contact info
    const hasContactInfo = text.includes("email") || text.includes("phone") || text.includes("@");
    if (!hasContactInfo) {
      errors.push("No contact information found. Add email or phone.");
      score -= 10;
    }

    // Ensure score stays within 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      score: Math.round(score),
      percentage: Math.round(score),
      feedback: errors,
      suggestions: suggestions
    };

  } catch (err) {
    console.error("ATS calculation error:", err);
    return {
      score: 50,
      percentage: 50,
      feedback: ["Error calculating ATS score"],
      suggestions: ["Please try uploading again"]
    };
  }
}

module.exports = calculateATSScore;