const axios = require("axios");

const getSpotifyUserId = async (accessToken) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userId = response.data.id;
    return userId;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

module.exports = {
  getSpotifyUserId,
};
