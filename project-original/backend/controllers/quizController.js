const readPDF = require("../mcp/pdfReader");
const extractResumeData = require("../mcp/resumeExtractor");
const generateQuiz = require("../mcp/quizGenerator");
const path = require("path");

async function generateQuizQuestions(req, res) {

const filePath = path.join(__dirname, "../data/sample.pdf");

const resumeText = await readPDF(filePath);

const resumeData = await extractResumeData(resumeText);

const quiz = await generateQuiz(resumeData);

res.json({
quiz
});

}

module.exports = { generateQuizQuestions };