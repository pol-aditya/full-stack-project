const askGemini = require("./geminiService");

async function matchJobs(resumeData) {

const prompt = `
You are a job recommendation AI.

Based on the resume information below, suggest 3 suitable job roles.

Resume Data:
${resumeData}

Return:
- job title
- required skills
- short reason
`;

const result = await askGemini(prompt, resumeData);

return result;

}

module.exports = matchJobs;