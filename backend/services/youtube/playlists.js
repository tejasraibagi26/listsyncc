const youtubeClient = require("../../utils/youtube");
const normalizePlaylistData = require("../../utils/normalizePlaylist");
const { platforms } = require("../../utils/constants");

const updatePlaylist = (playlists, item, data) => {
  const existingPlaylist = playlists.find((list) => list.id === item.id);
  if (existingPlaylist) {
    existingPlaylist.data = [...existingPlaylist.data, data];
  } else {
    playlists.push({
      id: item.id,
      data: [data],
      playlist: {
        name: item.snippet.title,
        thumbnails: item.snippet.thumbnails,
      },
    });
  }
};

const getPlaylist = async (accessToken) => {
  console.log("yt.service.getPlaylist.started");
  console.log("yt.service.accessToken accessToken=", accessToken);

  const youtube = youtubeClient(accessToken);
  const playlists = [];
  const likedSongs = [];

  try {
    const userPlaylists = await youtube.playlists.list({
      part: "id,snippet",
      mine: true,
      maxResults: 50,
    });

    await fetchAllLiked(accessToken, likedSongs);

    for (const likedSong of likedSongs) {
      updatePlaylist(
        playlists,
        {
          id: "LL",
          snippet: { title: "Liked Songs", thumbnails: [] },
        },
        likedSong
      );
    }

    for (const item of userPlaylists.data.items) {
      const videos = await getVideosInPlaylist(item.id, accessToken);

      for (let video of videos) {
        const data = await getVideoCategoryId(
          video.snippet.resourceId.videoId,
          accessToken
        );

        if (!data || data == undefined || data?.categoryId !== "10") break;

        updatePlaylist(playlists, item, data);
      }
    }

    const normalizedPlaylist = normalizePlaylistData(
      playlists,
      platforms.YOUTUBE
    );

    return normalizedPlaylist;
  } catch (error) {
    console.log("err", error);
    throw { status: error.status, message: error.message, error: error.error };
  }
};

async function fetchAllLiked(accessToken, likedSongs) {
  const youtube = youtubeClient(accessToken);
  const nextPageToken = null;

  try {
    do {
      const liked = await youtube.playlistItems.list({
        part: "snippet,contentDetails",
        playlistId: "LL",
        maxResults: 50,
      });

      for (const likedItems of liked.data.items) {
        const data = await getVideoCategoryId(
          likedItems.snippet.resourceId.videoId,
          accessToken
        );

        if (!data || data == undefined || data?.categoryId !== "10") break;

        likedSongs.push(data);
      }
    } while (nextPageToken);
  } catch (error) {
    console.error("Error fetching liked videos:");
    if (error.status === 403) {
      throw { status: error.status, message: "Qouta exceeded" };
    }
    throw {
      status: error.status,
      message: "Error fetching liked videos",
      error,
    };
  }
}

async function getVideosInPlaylist(playlistId, accessToken) {
  const youtube = youtubeClient(accessToken);

  let videos = [];
  let nextPageToken = null;

  do {
    try {
      const res = await youtube.playlistItems.list({
        part: "snippet",
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });
      videos = videos.concat(res.data.items);
      nextPageToken = res.data.nextPageToken;
    } catch (err) {
      console.log("err", err);
      break;
    }
  } while (nextPageToken);

  return videos;
}

async function getVideoCategoryId(videoId, accessToken) {
  const youtube = youtubeClient(accessToken);
  try {
    const res = await youtube.videos.list({
      part: "snippet",
      id: videoId,
    });

    if (res.data.items.length > 0) {
      const video = res.data.items[0];
      const title = video.snippet.title;
      const categoryId = video.snippet.categoryId;
      const description = video.snippet.description;
      const thumbnails = video.snippet.thumbnails;

      if (categoryId !== "10") return;
      const extracted = extractTitle(description);
      const artists = getArtists(extracted);

      const data = {
        title,
        categoryId,
        artists,
        videoId,
        thumbnails,
      };

      return data;
    } else {
      console.log("Video not found");
      return null;
    }
  } catch (err) {
    console.error("Error fetching video details:", err);
  }
}

function extractTitle(description) {
  return (
    description
      .split("\n")
      .find((line) => line.includes("·"))
      ?.trim() || null
  );
}

function getArtists(title) {
  const parts = title.split("·").map((part) => part.trim());
  return parts.slice(1);
}
module.exports = {
  getPlaylist,
  getVideosInPlaylist,
  getVideoCategoryId,
};
