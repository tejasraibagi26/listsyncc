const SpotifyService = require("../../services/spotify/playlists");

const getPlaylist = async (req, res) => {
  const accessToken = req.query.accessToken;
  const identifier = req.headers.identifier;

  try {
    if (!accessToken) throw { status: 400, err: "Missing access token" };

    const playlists = await SpotifyService.getPlaylist(accessToken, identifier);

    return res.json(playlists);
  } catch (error) {
    res.status(error?.status || 500).json(error);
  }
};

const transferPlaylist = async (req, res) => {
  const accessToken = req.query.accessToken;
  const source = req.params.source;
  const identifier = req.headers.identifier;

  const playlistsData = req?.body;

  try {
    if (!accessToken) throw { status: 400, err: "Missing access token" };

    const sync = await SpotifyService.syncPlaylist(
      accessToken,
      playlistsData,
      source,
      identifier
    );

    return res.json(sync);
  } catch (error) {
    res.status(error?.status || 500).json(error);
  }
};

module.exports = { getPlaylist, transferPlaylist };
