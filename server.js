require("dotenv").config();
const express = require("express");
const logger = require("./middleware/logger");
const notesRoutes = require("./routes/notesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Notes App API chal rahi hai! /api/notes try karo.");
});

app.use("/api/notes", notesRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route nahi mila" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server mein kuch ghalat hua" });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} pe chal raha hai`);
});