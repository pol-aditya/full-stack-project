const askGemini = require("./geminiService");

async function generateResume(profileData) {

const prompt = `
You are a professional resume builder.

Generate a professional resume using this information:

${profileData}

Sections:
- Professional Summary
- Skills
- Education
- Projects
- Experience
`;

const result = await askGemini(prompt, profileData);

return result;

}

module.exports = generateResume;