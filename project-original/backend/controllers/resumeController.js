const readPDF = require("../mcp/pdfReader");
const extractResumeData = require("../mcp/resumeExtractor");
const path = require("path");

async function analyzeResume(req, res) {

    const filePath = path.join(__dirname, "../data/sample.pdf");

    const resumeText = await readPDF(filePath);

    const extractedData = await extractResumeData(resumeText);

    res.json({
        resumeAnalysis: extractedData
    });
}

module.exports = { analyzeResume };