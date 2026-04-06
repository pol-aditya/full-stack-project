// const readPDF = require("../mcp/pdfReader");
// const askGemini = require("../mcp/geminiService");
// const Job = require("../models/Job");

// async function analyzeResume(req, res) {

//  try {

//   if (!req.files || req.files.length === 0) {
//    return res.status(400).json({ error: "No file uploaded" });
//   }

//   const filePath = req.files[0].path;

//   console.log("Uploaded file:", filePath);

//   const resumeText = await readPDF(filePath);

//   res.json({
//    message: "Resume parsed successfully",
//    preview: resumeText.substring(0,500)
//   });

//  } catch (err) {

//   console.log(err);

//   res.status(500).json({
//    error: err.message
//   });

//  }

// }

// module.exports = { analyzeResume };

const readPDF = require("../mcp/pdfReader");
const askGemini = require("../mcp/geminiService");
const Job = require("../models/Job");

async function analyzeResume(req, res) {

 try {

  if (!req.files || req.files.length === 0) {
   return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.files[0].path;

  const resumeText = await readPDF(filePath);

  const prompt = `
Extract technical skills from this resume.
Return only comma separated skills.

Resume:
${resumeText}
`;

  const aiResponse = await askGemini(prompt);

  const skills = aiResponse.split(",").map(s => s.trim());

  const jobs = await Job.find({
   skills: { $in: skills }
  });

  res.json({
   extracted_skills: skills,
   recommended_jobs: jobs
  });

 } catch (err) {

  console.log(err);

  res.status(500).json({
   error: err.message
  });

 }

}

module.exports = { analyzeResume };