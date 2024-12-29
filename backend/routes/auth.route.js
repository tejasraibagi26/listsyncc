// routes/authRoutes.js
const express = require("express");
const { callback, login } = require("../controllers/youtube/ytAuth.controller");
const {
  callback: spotifyCallback,
  login: spotifyLogin,
} = require("../controllers/spotify/spotifyAuth.controller");

const router = express.Router();

router.get("/yt/login", login);
router.get("/yt/callback", callback);
router.get("/spotify/login", spotifyLogin);
router.get("/spotify/callback", spotifyCallback);

module.exports = router;
