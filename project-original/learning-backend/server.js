const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");

// 👇 THIS LINE IS CRITICAL
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

console.log("userRoutes:", userRoutes);