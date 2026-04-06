const parseLinkedInJob = require("../mcp/linkedinParser");

async function extractJob(req, res) {

const postText = req.body.post;

const jobData = await parseLinkedInJob(postText);

res.json({
job: jobData
});

}

module.exports = { extractJob };