const readPDF = require("../mcp/pdfReader");
const extractResumeData = require("../mcp/resumeExtractor");
const matchJobs = require("../mcp/jobMatcher");
const path = require("path");

async function recommendJobs(req, res) {

const filePath = path.join(__dirname, "../data/sample.pdf");

const resumeText = await readPDF(filePath);

const resumeData = await extractResumeData(resumeText);

const jobs = await matchJobs(resumeData);

res.json({
jobs
});

}

module.exports = { recommendJobs };