const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
 name: String,
 domain: String,
 skills: [String],
 interests: String
});

module.exports = mongoose.model("Profile", profileSchema);