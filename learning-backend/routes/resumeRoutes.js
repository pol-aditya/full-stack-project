const express = require("express");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const db = require("../config/mysql");
const { callOpenRouter, safeJsonParse, DEFAULT_MODEL } = require("../services/openrouter");
const { parseResumeBuffer } = require("../services/resumeParser");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

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

const ensureResumeAnalysisTable = async () => {
  await queryAsync(`
    CREATE TABLE IF NOT EXISTS resume_analyses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(191) NOT NULL,
      file_name VARCHAR(255) NULL,
      resume_text LONGTEXT NOT NULL,
      job_description LONGTEXT NULL,
      analysis_json LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_resume_analyses_user_id (user_id)
    )
  `);
};

const saveResumeAnalysis = async ({ userId, fileName = null, resumeText, jobDescription = "", analysis }) => {
  await ensureResumeAnalysisTable();

  await queryAsync(
    `
      INSERT INTO resume_analyses (user_id, file_name, resume_text, job_description, analysis_json)
      VALUES (?, ?, ?, ?, ?)
    `,
    [userId, fileName, resumeText, jobDescription, JSON.stringify(analysis)]
  );
};

const getLatestResumeAnalysis = async (userId) => {
  await ensureResumeAnalysisTable();

  const rows = await queryAsync(
    `
      SELECT id, user_id, file_name, resume_text, job_description, analysis_json, created_at, updated_at
      FROM resume_analyses
      WHERE user_id = ?
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `,
    [userId]
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const row = rows[0];
  let parsedAnalysis = null;

  try {
    parsedAnalysis = JSON.parse(row.analysis_json);
  } catch (_error) {
    parsedAnalysis = null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    fileName: row.file_name,
    resumeText: row.resume_text,
    sourceJobDescription: row.job_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(parsedAnalysis || {}),
  };
};

const ATS_WEIGHTS = {
  keywordMatch: 35,
  skillsOntologyMatch: 20,
  semanticSimilarity: 15,
  experienceRelevance: 15,
  educationMatch: 7.5,
  parseabilityCompleteness: 7.5,
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "from",
  "this",
  "have",
  "your",
  "will",
  "you",
  "our",
  "are",
  "job",
  "role",
  "team",
  "work",
  "years",
  "year",
  "experience",
  "required",
  "preferred",
]);

const SKILL_ONTOLOGY = {
  programming: ["javascript", "typescript", "python", "java", "c++", "sql", "node", "react"],
  cloudDevOps: ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "terraform"],
  dataAi: ["machine learning", "nlp", "pandas", "numpy", "tensorflow", "pytorch", "analytics"],
  backend: ["api", "rest", "graphql", "microservices", "express", "spring", "django"],
  testing: ["unit testing", "integration", "jest", "cypress", "qa", "selenium"],
  softSkills: ["communication", "leadership", "stakeholder", "collaboration", "problem solving"],
};

const ROLE_PROFILES = [
  {
    id: "backend-engineer",
    titlePatterns: [/backend/i, /server/i, /api/i, /node/i, /java/i],
    priorityKeywords: [
      "node",
      "express",
      "rest",
      "api",
      "microservices",
      "sql",
      "mongodb",
      "redis",
      "docker",
      "aws",
    ],
  },
  {
    id: "frontend-engineer",
    titlePatterns: [/frontend/i, /ui/i, /react/i, /web/i],
    priorityKeywords: [
      "react",
      "typescript",
      "javascript",
      "next",
      "html",
      "css",
      "tailwind",
      "accessibility",
      "performance",
      "testing",
    ],
  },
  {
    id: "data-ai",
    titlePatterns: [/data/i, /ml/i, /machine learning/i, /ai/i, /analytics/i],
    priorityKeywords: [
      "python",
      "pandas",
      "numpy",
      "tensorflow",
      "pytorch",
      "nlp",
      "statistics",
      "sql",
      "model",
      "evaluation",
    ],
  },
  {
    id: "devops-cloud",
    titlePatterns: [/devops/i, /cloud/i, /sre/i, /platform/i],
    priorityKeywords: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "monitoring", "linux"],
  },
];

const ROLE_ALIGNMENT_PROFILES = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    keywords: ["react", "next", "javascript", "typescript", "html", "css", "tailwind", "redux", "ui", "frontend"],
    ontologyBuckets: ["programming", "testing"],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    keywords: ["node", "express", "api", "rest", "graphql", "sql", "mongodb", "postgres", "redis", "backend"],
    ontologyBuckets: ["programming", "backend", "cloudDevOps"],
  },
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    keywords: [
      "full stack",
      "frontend",
      "backend",
      "react",
      "node",
      "express",
      "typescript",
      "api",
      "sql",
      "docker",
    ],
    ontologyBuckets: ["programming", "backend", "testing", "cloudDevOps"],
  },
  {
    id: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    keywords: [
      "machine learning",
      "python",
      "pandas",
      "numpy",
      "tensorflow",
      "pytorch",
      "scikit",
      "model",
      "training",
      "evaluation",
    ],
    ontologyBuckets: ["programming", "dataAi"],
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    keywords: [
      "ai",
      "llm",
      "genai",
      "prompt",
      "rag",
      "nlp",
      "vector",
      "embedding",
      "langchain",
      "openai",
    ],
    ontologyBuckets: ["dataAi", "programming", "cloudDevOps"],
  },
];

const ACTION_VERBS = [
  "led",
  "built",
  "designed",
  "implemented",
  "optimized",
  "improved",
  "developed",
  "delivered",
  "reduced",
  "increased",
  "automated",
  "scaled",
  "migrated",
  "owned",
  "created",
];

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value = "") =>
  normalizeText(value)
    .replace(/[^a-z0-9+.#\-\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

const extractTopKeywords = (jobDescription, limit = 25) => {
  const tokens = tokenize(jobDescription);
  const freq = {};

  tokens.forEach((token) => {
    freq[token] = (freq[token] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([token]) => token);
};

const detectRoleProfile = (jobDescription) => {
  const jd = String(jobDescription || "");
  let bestProfile = null;
  let bestScore = 0;

  ROLE_PROFILES.forEach((profile) => {
    const score = profile.titlePatterns.reduce((acc, pattern) => acc + (pattern.test(jd) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestProfile = profile;
    }
  });

  if (!bestProfile) {
    return { id: "generic", priorityKeywords: [], confidence: 0 };
  }

  return {
    ...bestProfile,
    confidence: Number((bestScore / bestProfile.titlePatterns.length).toFixed(2)),
  };
};

const calculateKeywordMatch = (resumeText, jobDescription, roleProfile) => {
  const resume = normalizeText(resumeText);
  const jdKeywords = extractTopKeywords(jobDescription, 30);
  const coreRoleKeywords = (roleProfile?.priorityKeywords || []).slice(0, 15);

  const allKeywords = Array.from(new Set([...coreRoleKeywords, ...jdKeywords])).slice(0, 35);

  if (allKeywords.length === 0) {
    return { score: 0, presentKeywords: [], missingKeywords: [], coreMissingKeywords: [] };
  }

  const presentKeywords = allKeywords.filter((keyword) => resume.includes(keyword));
  const missingKeywords = allKeywords.filter((keyword) => !resume.includes(keyword));
  const coreMissingKeywords = coreRoleKeywords.filter((keyword) => !resume.includes(keyword));

  const jdPresent = jdKeywords.filter((keyword) => resume.includes(keyword)).length;
  const jdCoverage = jdKeywords.length ? jdPresent / jdKeywords.length : 0;
  const corePresent = coreRoleKeywords.filter((keyword) => resume.includes(keyword)).length;
  const coreCoverage = coreRoleKeywords.length ? corePresent / coreRoleKeywords.length : jdCoverage;

  const score = roleProfile?.id && roleProfile.id !== "generic" ? (coreCoverage * 0.55 + jdCoverage * 0.45) * 100 : jdCoverage * 100;

  return {
    score: clamp(score),
    presentKeywords,
    missingKeywords,
    coreMissingKeywords,
  };
};

const calculateSkillsOntologyMatch = (resumeText, jobDescription) => {
  const resume = normalizeText(resumeText);
  const jd = normalizeText(jobDescription);

  let requiredSkillsCount = 0;
  let matchedSkillsCount = 0;
  const matchedSkills = [];

  Object.values(SKILL_ONTOLOGY).forEach((skills) => {
    skills.forEach((skill) => {
      const skillInJd = jd.includes(skill);
      const skillInResume = resume.includes(skill);

      if (skillInJd) {
        requiredSkillsCount += 1;
      }

      if (skillInJd && skillInResume) {
        matchedSkillsCount += 1;
        matchedSkills.push(skill);
      }
    });
  });

  if (requiredSkillsCount === 0) {
    return { score: 60, matchedSkills: [] };
  }

  return {
    score: clamp((matchedSkillsCount / requiredSkillsCount) * 100),
    matchedSkills,
  };
};

const getOntologySkillSets = (resumeText, jobDescription) => {
  const resume = normalizeText(resumeText);
  const jd = normalizeText(jobDescription);

  const requiredSkills = [];
  const matchingSkills = [];

  Object.values(SKILL_ONTOLOGY).forEach((skills) => {
    skills.forEach((skill) => {
      if (jd.includes(skill)) {
        requiredSkills.push(skill);
        if (resume.includes(skill)) {
          matchingSkills.push(skill);
        }
      }
    });
  });

  const uniqueRequired = Array.from(new Set(requiredSkills));
  const uniqueMatching = Array.from(new Set(matchingSkills));
  const missingSkills = uniqueRequired.filter((skill) => !uniqueMatching.includes(skill));

  return {
    requiredSkills: uniqueRequired,
    matchingSkills: uniqueMatching,
    missingSkills,
  };
};

const extractRequiredYears = (jobDescription) => {
  const matches = [...jobDescription.matchAll(/(\d{1,2})\+?\s*(?:-|to)?\s*\d{0,2}?\s*years?/gi)];
  if (matches.length === 0) {
    return null;
  }

  return Math.max(...matches.map((match) => Number(match[1])).filter(Number.isFinite));
};

const estimateResumeYears = (resumeText) => {
  const explicitYears = [...resumeText.matchAll(/(\d{1,2})\+?\s*years?/gi)]
    .map((match) => Number(match[1]))
    .filter(Number.isFinite);

  if (explicitYears.length > 0) {
    return Math.max(...explicitYears);
  }

  return 0;
};

const calculateExperienceRelevance = (resumeText, jobDescription) => {
  const requiredYears = extractRequiredYears(jobDescription);
  const resumeYears = estimateResumeYears(resumeText);

  if (!requiredYears) {
    return {
      score: resumeYears > 0 ? 75 : 55,
      requiredYears: null,
      resumeYears,
    };
  }

  if (resumeYears <= 0) {
    return { score: 35, requiredYears, resumeYears };
  }

  const yearsScore = clamp((resumeYears / requiredYears) * 100);
  return { score: yearsScore, requiredYears, resumeYears };
};

const calculateEducationMatch = (resumeText, jobDescription) => {
  const jd = normalizeText(jobDescription);
  const resume = normalizeText(resumeText);

  const degreeTerms = ["bachelor", "master", "phd", "b.tech", "m.tech", "mba", "degree"];
  const requiredDegrees = degreeTerms.filter((term) => jd.includes(term));

  if (requiredDegrees.length === 0) {
    return { score: 70, requiredDegrees: [], matchedDegrees: [] };
  }

  const matchedDegrees = requiredDegrees.filter((term) => resume.includes(term));
  const score = (matchedDegrees.length / requiredDegrees.length) * 100;

  return {
    score: clamp(score),
    requiredDegrees,
    matchedDegrees,
  };
};

const calculateParseabilityCompleteness = (resumeText) => {
  const resume = normalizeText(resumeText);
  const checks = {
    email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText),
    phone: /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/.test(resumeText),
    experienceSection: /experience|work history|employment/i.test(resume),
    educationSection: /education|academic/i.test(resume),
    skillsSection: /skills|technical skills|core competencies/i.test(resume),
  };

  const totalChecks = Object.keys(checks).length;
  const passedChecks = Object.values(checks).filter(Boolean).length;

  return {
    score: clamp((passedChecks / totalChecks) * 100),
    checks,
  };
};

const calculateRoleAlignment = (resumeText, profile) => {
  const resume = normalizeText(resumeText);
  const profileKeywords = profile.keywords || [];
  const matchedKeywords = profileKeywords.filter((keyword) => resume.includes(keyword));
  const missingKeywords = profileKeywords.filter((keyword) => !resume.includes(keyword));

  const keywordCoverage = profileKeywords.length ? (matchedKeywords.length / profileKeywords.length) * 100 : 0;

  const ontologySkills = (profile.ontologyBuckets || [])
    .flatMap((bucket) => SKILL_ONTOLOGY[bucket] || [])
    .filter(Boolean);
  const uniqueOntologySkills = Array.from(new Set(ontologySkills));
  const matchedOntologySkills = uniqueOntologySkills.filter((skill) => resume.includes(skill));
  const ontologyCoverage = uniqueOntologySkills.length
    ? (matchedOntologySkills.length / uniqueOntologySkills.length) * 100
    : keywordCoverage;

  const hasProjectsSignal = /projects?|portfolio|github/i.test(resumeText);
  const experienceYears = estimateResumeYears(resumeText);
  const evidenceScore = clamp((hasProjectsSignal ? 55 : 30) + Math.min(experienceYears, 8) * 5);

  const score = clamp(keywordCoverage * 0.6 + ontologyCoverage * 0.25 + evidenceScore * 0.15);

  return {
    roleId: profile.id,
    roleName: profile.title,
    score: Math.round(score),
    matchedKeywords,
    missingKeywords,
    matchedSkills: matchedOntologySkills,
    keywordCoverage: Math.round(keywordCoverage),
    ontologyCoverage: Math.round(ontologyCoverage),
  };
};

const assessSectionQuality = (resumeText, roleProfile) => {
  const lines = splitResumeLines(resumeText);
  const resume = normalizeText(resumeText);

  const sectionSignals = {
    summary: /summary|profile|objective/i.test(resume),
    projects: /projects?|portfolio|github/i.test(resume),
    achievements: /achievements?|accomplishments?|impact/i.test(resume),
    certifications: /certifications?|certified/i.test(resume),
  };

  const quantifiedLines = lines.filter((line) => /\d|%|\$|x\b|\bms\b|\bsec\b/i.test(line));
  const actionVerbHits = ACTION_VERBS.filter((verb) => new RegExp(`\\b${verb}\\b`, "i").test(resume));

  const penalties = [];
  let penaltyPoints = 0;

  if (!sectionSignals.summary) {
    penalties.push("Missing a clear summary/profile section.");
    penaltyPoints += 4;
  }

  if (roleProfile?.id !== "generic" && !sectionSignals.projects) {
    penalties.push("Project evidence is weak for the detected role profile.");
    penaltyPoints += 6;
  }

  if (quantifiedLines.length < 3) {
    penalties.push("Few quantified impact bullets detected.");
    penaltyPoints += 8;
  }

  if (actionVerbHits.length < 4) {
    penalties.push("Low density of action-oriented achievement verbs.");
    penaltyPoints += 6;
  }

  return {
    sectionSignals,
    quantifiedBulletCount: quantifiedLines.length,
    actionVerbHits,
    penalties,
    penaltyPoints,
  };
};

const calculateSemanticSimilarity = async (resumeText, jobDescription) => {
  try {
    const systemPrompt =
      "You are a strict scorer. Compare resume and job description semantic relevance. Return only JSON: { \"semanticSimilarity\": number, \"reason\": string } where semanticSimilarity is 0-100.";
    const userPrompt = `Job Description:\n${jobDescription}\n\nResume:\n${resumeText}`;

    const output = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0,
      maxTokens: 220,
    });

    const parsed = safeJsonParse(output);
    const semanticSimilarity = Number(parsed?.semanticSimilarity);

    if (Number.isFinite(semanticSimilarity)) {
      return {
        score: clamp(semanticSimilarity),
        reason: parsed?.reason || "AI semantic similarity",
      };
    }
  } catch (_error) {
    // Fall back to lexical approximation if model call fails.
  }

  const resumeTokens = new Set(tokenize(resumeText));
  const jdTokens = new Set(tokenize(jobDescription));
  const overlap = [...jdTokens].filter((token) => resumeTokens.has(token)).length;
  const denom = jdTokens.size || 1;

  return {
    score: clamp((overlap / denom) * 100),
    reason: "Lexical fallback similarity",
  };
};

const splitResumeLines = (resumeText) =>
  String(resumeText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const extractExperienceEntries = (resumeText) => {
  const lines = splitResumeLines(resumeText);
  const experiencePattern = /(engineer|developer|intern|manager|analyst|consultant|lead|architect|specialist)/i;
  const yearPattern = /(19|20)\d{2}|\d{1,2}\+?\s*years?/i;

  return lines
    .filter((line) => experiencePattern.test(line) || yearPattern.test(line))
    .slice(0, 8)
    .map((line) => ({
      text: line,
      hasYearSignal: yearPattern.test(line),
    }));
};

const extractEducationEntries = (resumeText) => {
  const lines = splitResumeLines(resumeText);
  const educationPattern = /(bachelor|master|phd|b\.tech|m\.tech|mba|university|college|institute|degree)/i;

  return lines
    .filter((line) => educationPattern.test(line))
    .slice(0, 6)
    .map((line) => ({ text: line }));
};

const buildAtsEvaluation = async (resumeText) => {
  const parseability = calculateParseabilityCompleteness(resumeText);
  const sectionQuality = assessSectionQuality(resumeText, { id: "generic" });
  const parseabilityAdjustedScore = clamp(parseability.score - sectionQuality.penaltyPoints);
  const extractedExperience = extractExperienceEntries(resumeText);
  const extractedEducation = extractEducationEntries(resumeText);

  const roleAlignments = ROLE_ALIGNMENT_PROFILES.map((profile) => calculateRoleAlignment(resumeText, profile)).sort(
    (a, b) => b.score - a.score
  );

  const topRole = roleAlignments[0] || {
    roleId: "general",
    roleName: "General Engineering",
    score: 0,
    matchedKeywords: [],
    missingKeywords: [],
    matchedSkills: [],
  };

  const overallScore = Math.round(clamp(topRole.score * 0.75 + parseabilityAdjustedScore * 0.25));

  const feedback = [
    `Best alignment detected for ${topRole.roleName} (${topRole.score}%).`,
    ...roleAlignments.slice(1, 3).map((item) => `Also aligned with ${item.roleName} (${item.score}%).`),
  ];

  const suggestions = [
    `For ${topRole.roleName}, add more evidence around: ${topRole.missingKeywords.slice(0, 5).join(", ") || "role-specific impact"}.`,
    "Include quantified outcomes in experience/projects to improve role confidence.",
  ];

  const detailedIssues = [];
  if (parseabilityAdjustedScore < 70) {
    const failedChecks = Object.entries(parseability.checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);
    detailedIssues.push(`Parseability gaps detected: ${failedChecks.join(", ") || "none"}.`);
  }
  if (sectionQuality.penalties.length > 0) {
    detailedIssues.push(`Section quality penalties: ${sectionQuality.penalties.join(" ")}`);
  }

  const allMatchedSkills = Array.from(new Set(roleAlignments.flatMap((item) => item.matchedSkills || [])));
  const allPresentKeywords = Array.from(new Set(roleAlignments.flatMap((item) => item.matchedKeywords || [])));
  const coreMissingKeywords = topRole.missingKeywords.slice(0, 10);
  const missingSignalItems =
    topRole.score >= 60
      ? coreMissingKeywords.slice(0, 5).map((term) => `Add stronger evidence for: ${term}`)
      : [
          "Add measurable impact in experience bullets (percent, scale, time saved).",
          "Highlight role-relevant projects with tools and outcomes.",
          "Make skills section more explicit for your target roles.",
        ];

  return {
    atsScore: {
      score: overallScore,
      feedback,
      suggestions,
      detailedIssues,
      breakdown: {
        topRoleAlignment: {
          weight: 75,
          score: topRole.score,
          weightedContribution: Number((topRole.score * 0.75).toFixed(2)),
        },
        parseabilityCompleteness: {
          weight: 25,
          score: Math.round(parseabilityAdjustedScore),
          weightedContribution: Number((parseabilityAdjustedScore * 0.25).toFixed(2)),
          checks: parseability.checks,
        },
      },
      scoringFormula: "Overall Score = 75% top role alignment + 25% resume parseability/completeness",
    },
    extractedData: {
      skills: allMatchedSkills,
      experience: extractedExperience,
      education: extractedEducation,
    },
    keywordAnalysis: {
      presentKeywords: allPresentKeywords,
      missingKeywords: coreMissingKeywords,
      coreMissingKeywords,
    },
    analysisMeta: {
      roleProfile: topRole.roleId,
      roleProfileConfidence: Number((topRole.score / 100).toFixed(2)),
      sectionQuality,
      scoringVersion: "role-alignment-v1",
    },
    roleAlignment: {
      topRole: {
        id: topRole.roleId,
        name: topRole.roleName,
        score: topRole.score,
      },
      roles: roleAlignments,
    },
    structuredAnalysis: {
      matchingRequirements: {
        title: "Strong Role Matches",
        items: roleAlignments.slice(0, 3).map((item) => `${item.roleName}: ${item.score}% alignment`),
      },
      missingRequirements: {
        title: "Top Missing Signals For Best-Matched Role",
        items: missingSignalItems,
      },
      skillsAnalysis: {
        title: "Role Alignment Skills",
        matchingSkills: allMatchedSkills,
        requiredSkills: topRole.matchedKeywords,
        missingSkills: coreMissingKeywords,
        summary: `Resume analyzed against ${ROLE_ALIGNMENT_PROFILES.length} engineering roles without job description input.`,
      },
      experienceAnalysis: {
        title: "Experience Analysis",
        requiredExperience: "Role-based heuristic",
        currentExperience: `${estimateResumeYears(resumeText)} years (detected)` ,
        status: extractedExperience.length > 0 ? "Partially Meets" : "Needs More Evidence",
        assessment:
          extractedExperience.length > 0
            ? "Experience signals were found; add more role-specific outcomes to strengthen fit."
            : "Few explicit experience signals detected; add clear project and impact bullets.",
      },
      educationEligibility: {
        title: "Education Eligibility",
        requiredQualifications: [],
        matchedQualifications: extractedEducation.map((entry) => entry.text),
        status: extractedEducation.length > 0 ? "Eligible" : "Unknown",
        assessment:
          extractedEducation.length > 0
            ? "Education details are present in the resume."
            : "Education section is not clearly detected.",
      },
      finalVerdict: {
        title: "Final Verdict",
        fit: overallScore >= 75 ? "Strong fit" : overallScore >= 55 ? "Moderate fit" : "Weak fit",
        reason: `Best role match is ${topRole.roleName} at ${topRole.score}% alignment.`,
      },
    },
  };
};

const buildFallbackCustomizedResume = (resumeText, jobDescription) => {
  const jdKeywords = extractTopKeywords(jobDescription, 12);
  const normalizedResume = normalizeText(resumeText);
  const missingKeywords = jdKeywords.filter((keyword) => !normalizedResume.includes(keyword)).slice(0, 8);

  const suggestedBullets = missingKeywords.slice(0, 5).map(
    (keyword) => `- Tailor one experience bullet to highlight impact with ${keyword}.`
  );

  const additionsSection = [
    "",
    "Targeted Keywords To Include",
    missingKeywords.length ? missingKeywords.join(", ") : "No major keyword gaps detected.",
    "",
    "Suggested Bullet Improvements",
    ...(suggestedBullets.length ? suggestedBullets : ["- Quantify project outcomes with percentages, scale, or response-time gains."]),
  ].join("\n");

  return {
    customizedResumeText: `${resumeText.trim()}\n${additionsSection}`,
    summary: "Generated fallback customization because the AI provider was unavailable.",
    highlightedChanges: [
      "Added a targeted keyword section based on the job description.",
      "Added role-specific bullet improvement suggestions.",
    ],
    keywordsAdded: missingKeywords,
  };
};

const buildStructuredFallbackResume = (resumeText, jobDescription, fallback) => {
  const experienceLines = extractExperienceEntries(resumeText).map((entry) => entry.text);
  const educationLines = extractEducationEntries(resumeText).map((entry) => entry.text);

  return {
    heading: "Customized Resume",
    targetRole: "Tailored to provided job description",
    professionalSummary:
      fallback.summary ||
      `Tailored resume focused on requirements from the provided job description: ${jobDescription.slice(0, 220)}.`,
    skills: fallback.keywordsAdded || [],
    experienceHighlights: experienceLines.slice(0, 8),
    projectHighlights: [],
    education: educationLines.slice(0, 6),
    certifications: [],
    additionalNotes: fallback.highlightedChanges || [],
  };
};

const buildStructuredResumeText = (structured) => {
  const section = (title, items = []) => {
    if (!Array.isArray(items) || items.length === 0) {
      return `${title}\n- N/A`;
    }

    return `${title}\n${items.map((item) => `- ${item}`).join("\n")}`;
  };

  return [
    `${structured.heading || "Customized Resume"}`,
    `${structured.targetRole || ""}`.trim(),
    "",
    "Professional Summary",
    structured.professionalSummary || "N/A",
    "",
    section("Skills", structured.skills),
    "",
    section("Experience Highlights", structured.experienceHighlights),
    "",
    section("Project Highlights", structured.projectHighlights),
    "",
    section("Education", structured.education),
    "",
    section("Certifications", structured.certifications),
    "",
    section("Additional Notes", structured.additionalNotes),
  ]
    .filter((line) => typeof line === "string")
    .join("\n")
    .trim();
};

const buildResumePdfBase64 = async (textContent) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString("base64"));
    });
    doc.on("error", (error) => reject(error));

    const lines = String(textContent || "")
      .split(/\r?\n/)
      .map((line) => line.trimEnd());

    lines.forEach((line) => {
      if (!line) {
        doc.moveDown(0.35);
        return;
      }

      const isSectionTitle = !line.startsWith("-") && /^[A-Za-z][A-Za-z\s&]+$/.test(line);
      doc.font(isSectionTitle ? "Helvetica-Bold" : "Helvetica");
      doc.fontSize(isSectionTitle ? 12 : 10.5);
      doc.text(line, { align: "left" });
    });

    doc.end();
  });

router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No resume file uploaded" });
  }

  const userId = req.body?.userId || "demo-user";

  try {
    const resumeText = await parseResumeBuffer(req.file);

    if (!resumeText || resumeText.length < 40) {
      return res.status(400).json({
        message: "Could not extract enough text from the resume. Try a clearer PDF/DOCX.",
      });
    }

    const evaluation = await buildAtsEvaluation(resumeText);
    const analysisRecord = {
      fileName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
      resumeTextLength: resumeText.length,
      ...evaluation,
    };

    await saveResumeAnalysis({
      userId,
      fileName: req.file.originalname,
      resumeText,
      jobDescription: "",
      analysis: analysisRecord,
    });

    return res.json({
      message: "Resume uploaded and analyzed successfully",
      data: {
        ...analysisRecord,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to parse and analyze uploaded resume",
    });
  }
});

router.post("/resume-analysis", async (req, res) => {
  const { userId = "demo-user" } = req.body || {};

  try {
    const latest = await getLatestResumeAnalysis(userId);

    if (!latest) {
      return res.json({
        message: "No saved resume analysis found",
        data: null,
        userId,
      });
    }

    return res.json({
      message: "Saved resume analysis loaded",
      data: latest,
      userId,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to load resume analysis",
    });
  }
});

router.post("/resume/customize", async (req, res) => {
  const { jobDescription, resumeText = "", resumeId = null, userId = "demo-user" } = req.body || {};

  if (!jobDescription || typeof jobDescription !== "string") {
    return res.status(400).json({ message: "jobDescription is required" });
  }

  try {
    let sourceResumeText = String(resumeText || "").trim();

    if (!sourceResumeText) {
      const latest = await getLatestResumeAnalysis(userId);
      sourceResumeText = String(latest?.resumeText || "").trim();
    }

    if (!sourceResumeText) {
      return res.status(400).json({
        message: "No resume text found. Upload a resume first or pass resumeText.",
      });
    }

    const systemPrompt =
      "You are an expert resume writer. Rewrite the resume for the job description while keeping facts truthful. Return strict JSON with keys: structuredResume (object), summary (string), highlightedChanges (array of strings), keywordsAdded (array of strings). structuredResume must include: heading (string), targetRole (string), professionalSummary (string), skills (array of strings), experienceHighlights (array of strings), projectHighlights (array of strings), education (array of strings), certifications (array of strings), additionalNotes (array of strings).";
    const userPrompt = `Job Description:\n${jobDescription}\n\nCurrent Resume Text:\n${sourceResumeText}`;

    let output = "";
    let parsed = null;

    try {
      output = await callOpenRouter({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
        maxTokens: 1600,
      });
      parsed = safeJsonParse(output);
    } catch (_providerError) {
      parsed = null;
    }

    const fallback = buildFallbackCustomizedResume(sourceResumeText, jobDescription);
    const structuredFallback = buildStructuredFallbackResume(sourceResumeText, jobDescription, fallback);
    const structuredResume =
      (parsed?.structuredResume && typeof parsed.structuredResume === "object" && parsed.structuredResume) ||
      structuredFallback;
    const customizedResumeText = buildStructuredResumeText(structuredResume);

    const summary = (typeof parsed?.summary === "string" && parsed.summary) || fallback.summary;
    const highlightedChanges =
      (Array.isArray(parsed?.highlightedChanges) && parsed.highlightedChanges) || fallback.highlightedChanges;
    const keywordsAdded = (Array.isArray(parsed?.keywordsAdded) && parsed.keywordsAdded) || fallback.keywordsAdded;

    const downloadFileName = `customized-resume-${Date.now()}.pdf`;
    const pdfBase64 = await buildResumePdfBase64(customizedResumeText);

    const postCustomizationEvaluation = await buildAtsEvaluation(customizedResumeText);
    await saveResumeAnalysis({
      userId,
      fileName: downloadFileName,
      resumeText: customizedResumeText,
      jobDescription,
      analysis: {
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        source: "customize-route",
        resumeTextLength: customizedResumeText.length,
        ...postCustomizationEvaluation,
      },
    });

    return res.json({
      message: "Resume customization generated",
      data: {
        resumeId,
        userId,
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        structuredResume,
        customizedResumeText,
        summary,
        highlightedChanges,
        keywordsAdded,
        download: {
          fileName: downloadFileName,
          mimeType: "application/pdf",
          contentBase64: pdfBase64,
        },
        downloadText: {
          fileName: `customized-resume-${Date.now()}.txt`,
          mimeType: "text/plain",
          contentBase64: Buffer.from(customizedResumeText, "utf8").toString("base64"),
        },
        raw: output,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to customize resume with AI",
    });
  }
});

router.post("/resume/analyze", async (req, res) => {
  const { resumeText, userId = "demo-user" } = req.body || {};

  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ message: "resumeText is required" });
  }

  try {
    const evaluation = await buildAtsEvaluation(resumeText);
    const analysisRecord = {
      model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
      resumeTextLength: resumeText.length,
      ...evaluation,
    };

    await saveResumeAnalysis({
      userId,
      fileName: null,
      resumeText,
      jobDescription: "",
      analysis: analysisRecord,
    });

    return res.json({
      message: "Resume analyzed successfully",
      data: {
        ...analysisRecord,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to analyze resume with AI",
    });
  }
});

router.get("/ats-score", (req, res) => {
  return res.json({
    message: "No ATS score available until a resume is uploaded",
    data: null,
  });
});

module.exports = router;
