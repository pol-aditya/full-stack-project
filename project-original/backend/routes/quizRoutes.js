const express = require("express");
const router = express.Router();

const { generateQuizQuestions } = require("../controllers/quizController");

router.get("/generate-quiz", generateQuizQuestions);

module.exports = router;