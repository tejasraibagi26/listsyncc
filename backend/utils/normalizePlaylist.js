const { platforms } = require("./constants");

const normalizePlaylistData = (playlist, source) => {
  if (!Array.isArray(playlist)) {
    throw new Error("Playlist must be an array");
  }

  return playlist.map((song) => {
    switch (source) {
      case platforms.SPOTIFY:
        return {
          playlist: {
            id: song.id,
            name: song.name,
          },
        };

      case platforms.YOUTUBE:
        return {
          playlist: { name: song.playlist.name, id: song.id },
          songs: song.data.map((item) => ({
            id: item.videoId,
            title: item.title,
            artist: item.artists?.join(", ") || "Unknown Artist",
            album: song.playlist.name,
            platform: "YouTube",
            thumbnail: item.thumbnails?.high?.url || null, // Prefer the 'high' thumbnail
          })),
        };
      case platforms.APPLE_MUSIC:
        return {
          id: song.id,
          title: song.attributes.name,
          artist: song.attributes.artistName,
          album: song.attributes.albumName || "Unknown Album",
          platform: "AppleMusic",
          thumbnail: song.attributes.artwork?.url
            ? song.attributes.artwork.url.replace("{w}x{h}", "300x300")
            : null,
        };

      default:
        throw new Error("Unsupported platform");
    }
  });
};

module.exports = normalizePlaylistData;
