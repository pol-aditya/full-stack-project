const askGemini = require("./geminiService");

async function generateQuiz(resumeData) {

const prompt = `
You are an interview preparation assistant.

Based on the candidate skills below, generate 5 technical quiz questions.

Skills:
${resumeData}

Return questions in a numbered list.
`;

const result = await askGemini(prompt, resumeData);

return result;

}

module.exports = generateQuiz;