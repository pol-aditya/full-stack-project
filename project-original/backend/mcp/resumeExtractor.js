const askGemini = require("./geminiService");

async function extractResumeData(resumeText) {

    const prompt = `
Extract structured information from this resume.

Return in JSON format with these fields:
- name
- skills
- education
- projects
- experience

Resume:
${resumeText}
`;

    const result = await askGemini(prompt, resumeText);

    return result;
}

module.exports = extractResumeData;