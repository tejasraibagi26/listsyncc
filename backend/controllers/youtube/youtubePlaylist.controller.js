const playlistService = require("../../services/youtube/playlists");

const getPlaylist = async (req, res) => {
  console.log("yt.api.getPlaylist.started");
  const accessToken = req.query.accessToken;

  try {
    if (!accessToken) throw { status: 400, err: "Missing access token" };

    const playlists = await playlistService.getPlaylist(accessToken);

    return res.json(playlists);
  } catch (error) {
    res.status(error?.status || 500).json(error);
  }
};

module.exports = { getPlaylist };
