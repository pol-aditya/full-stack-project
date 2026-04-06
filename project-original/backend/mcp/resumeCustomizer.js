const askGemini = require("./geminiService");

async function customizeResume(resumeText, jobDescription) {

const prompt = `
You are an ATS optimization expert.

Customize the resume to better match the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Improve the resume by:
- Adding missing keywords
- Reordering skills
- Highlighting relevant projects
- Improving ATS match
`;

const result = await askGemini(prompt, resumeText + jobDescription);

return result;

}

module.exports = customizeResume;