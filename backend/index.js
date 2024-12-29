require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());

const authRoutes = require("./routes/auth.route");
const ytRoutes = require("./routes/youtube.route");
const spotifyRoutes = require("./routes/spotify.route");

const allowedOrigins = ["http://localhost:3000"];

// Use CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/youtube", ytRoutes);
app.use("/spotify", spotifyRoutes);

app.get("/ping", (req, res) => {
  return res.json({ apiVersion: 1.0, health: "good" });
});

// Start the server
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
