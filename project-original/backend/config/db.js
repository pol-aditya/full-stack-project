const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not defined in .env file - running in development mode without database");
} else {
    mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully");
    })
    .catch((err) => {
        console.warn("MongoDB connection error:", err.message);
        console.warn("Continuing without database - ensure credentials are correct in .env");
    });
}