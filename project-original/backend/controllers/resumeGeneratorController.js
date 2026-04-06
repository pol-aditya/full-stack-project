const generateResume = require("../mcp/resumeGenerator");

async function createResume(req, res) {

const profileData = req.body.profile;

const resume = await generateResume(profileData);

res.json({
generated_resume: resume
});

}

module.exports = { createResume };