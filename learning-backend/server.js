const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectMongo = require("./config/db");
const mysqlDB = require("./config/mysql");

dotenv.config();
connectMongo();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
// Connect Routes
const userRoutes = require("./routes/userRoutes.js");

app.use("/api/users", userRoutes); 
app.use("/api/auth", userRoutes);