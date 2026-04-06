const readPDF = require("../mcp/pdfReader");
const customizeResume = require("../mcp/resumeCustomizer");
const path = require("path");

async function customizeResumeForJob(req, res) {

const jobDescription = req.body.job;

const filePath = path.join(__dirname, "../data/sample.pdf");

const resumeText = await readPDF(filePath);

const optimizedResume = await customizeResume(resumeText, jobDescription);

res.json({
optimized_resume: optimizedResume
});

}

module.exports = { customizeResumeForJob };