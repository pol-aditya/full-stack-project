const readPDF = require("../mcp/pdfReader");
const askGemini = require("../mcp/geminiService");
const path = require("path");

async function chat(req, res) {

    const question = req.body.question;

    const filePath = path.join(__dirname, "../data/sample.pdf");

    const documentText = await readPDF(filePath);

    const answer = await askGemini(question, documentText);

    res.json({
        question: question,
        answer: answer
    });
}

module.exports = { chat };