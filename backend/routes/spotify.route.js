const express = require("express");
const {
  getPlaylist,
  transferPlaylist,
} = require("../controllers/spotify/spotifyPlaylist.controller");

const router = express.Router();

router.get("/playlists", getPlaylist);
router.post("/transfer/:source", transferPlaylist);

module.exports = router;
