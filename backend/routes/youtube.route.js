const express = require("express");
const {
  getPlaylist,
} = require("../controllers/youtube/youtubePlaylist.controller");
const router = express.Router();

router.get("/playlists", getPlaylist);

module.exports = router;
