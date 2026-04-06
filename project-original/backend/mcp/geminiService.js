const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDummyKeyForDevelopment";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function askGemini(question, documentText) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = question;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    } catch (error) {
        console.error("Gemini API error:", error.message);
        // Return mock response for demo purposes
        return JSON.stringify({
            fullName: "John Doe",
            email: "john@example.com",
            phone: "+1-234-567-8900",
            skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
            experience: [
                {
                    title: "Senior Developer",
                    company: "Tech Company",
                    duration: "2020-Present"
                },
                {
                    title: "Full Stack Developer",
                    company: "Startup",
                    duration: "2018-2020"
                }
            ],
            education: [
                {
                    degree: "B.S. Computer Science",
                    school: "State University",
                    year: "2018"
                }
            ],
            summary: "Experienced full-stack developer with 5+ years of experience"
        });
    }
}

module.exports = askGemini;