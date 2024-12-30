const { logFactory, logType, status } = require("../../utils/logger");
const axios = require("axios");
const normalizePlaylistData = require("../../utils/normalizePlaylist");
const { platforms } = require("../../utils/constants");
const { getSpotifyUserId } = require("./utils");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPlaylist = async (accessToken, indentifier) => {
  const logger = logFactory({
    logType: logType.service,
    fnName: "getPlaylist",
    indentifier,
  });

  logger.info({ eventStatus: status.started });

  let playlists = [];
  let nextUrl = "https://api.spotify.com/v1/me/playlists";

  try {
    while (nextUrl) {
      const response = await axios.get(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      playlists = playlists.concat(
        response.data.items.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          tracks: playlist.tracks.total,
          owner: playlist.owner.display_name,
          public: playlist.public,
        }))
      );

      nextUrl = response.data.next;
    }

    const normalizedPlaylist = normalizePlaylistData(
      playlists,
      platforms.SPOTIFY
    );

    return normalizedPlaylist;
  } catch (error) {
    console.error(
      "Error fetching all playlists:",
      error.response?.data || error
    );
    throw error;
  }
};

const syncPlaylist = async (accessToken, playlists, source, identifier) => {
  const logger = logFactory({
    logType: logType.service,
    fnName: "spotify-playlist-sync",
    identifier,
  });

  const transferCompleted = [];
  const errors = [];
  const fullfilled = [];

  logger.info({ eventStatus: status.started });

  try {
    const user_id = await getSpotifyUserId(accessToken);

    for (let playlistItem of playlists) {
      const {
        playlist: { name },
        songs,
      } = playlistItem;

      const spotifyPlaylistId = createPlaylistResponse.data.id;

      const trackURIs = await getTrackUriWithDelay(
        songs,
        accessToken,
        errors,
        fullfilled,
        200
      );

      const filtered = trackURIs.filter((uri) => uri);

      if (filtered.length === 0) {
        console.log(`Playlist "${name}" not synced to Spotify.`);
        return {
          transferFailed: [playlistItem],
          errors: ["Could not find any songs on Spotify"],
        };
      }

      // Add the tracks to the Spotify playlist
      await axios
        .post(
          `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`,
          {
            uris: trackURIs.filter((uri) => uri),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => {
          transferCompleted.push(playlistItem);
        })
        .catch((err) => {
          console.log("err", err);
        });

      console.log(`Playlist "${name}" synced to Spotify.`);
    }

    return {
      fullfilled,
      errors,
      transferCompleted,
    };
  } catch (error) {
    console.error("Error syncing playlist to Spotify:", error);
  }
};

const getTrackUriWithDelay = async (
  songs,
  accessToken,
  errors,
  fullfilled,
  delay = 200
) => {
  const uris = [];

  for (const song of songs) {
    try {
      const spotifyUri = await searchSpotifyTrack(
        song,
        accessToken,
        errors,
        fullfilled
      );

      uris.push(spotifyUri);

      await delay(delay);
    } catch (error) {}
  }

  return uris;
};

const searchSpotifyTrack = async (song, accessToken, errors, fullfilled) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=track:${song.title} artist:${song.artist}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const track = response.data.tracks.items[0];

    if (track) {
      fullfilled.push({
        id: song.id,
        song: song,
      });
      return track.uri;
    } else {
      console.error("Track not found on Spotify:", song.title, song.artist);
      errors.push({
        id: song.id,
        song: song,
        errReason: "song not found",
      });
      return null;
    }
  } catch (error) {
    console.error("Error searching for track on Spotify:", error);
    errors.push({
      id: song.id,
      song: song,
      errReason: error,
    });
    return null;
  }
};

module.exports = {
  getPlaylist,
  syncPlaylist,
};
