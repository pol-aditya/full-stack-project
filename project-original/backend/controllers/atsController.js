const readPDF = require("../mcp/pdfReader");
const analyzeATS = require("../mcp/atsAnalyzer");
const path = require("path");

async function analyzeResumeATS(req, res) {

const filePath = path.join(__dirname, "../data/sample.pdf");

const resumeText = await readPDF(filePath);

const atsResult = await analyzeATS(resumeText);

res.json({
ATS_Analysis: atsResult
});

}

module.exports = { analyzeResumeATS };