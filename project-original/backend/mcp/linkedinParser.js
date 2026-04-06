const askGemini = require("./geminiService");

async function parseLinkedInJob(postText) {

const prompt = `
Extract job information from this LinkedIn job post.

Return:
- Job Title
- Company
- Required Skills
- Experience
- Job Description summary

Post:
${postText}
`;

const result = await askGemini(prompt, postText);

return result;

}

module.exports = parseLinkedInJob;