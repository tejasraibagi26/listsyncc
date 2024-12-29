// utils/tokenUtils.js
const axios = require("axios");
const googleConfig = require("../config/google.config");

// Refresh the access token using the refresh token
const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: googleConfig.clientId,
    client_secret: googleConfig.clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  return response.data.access_token;
};

module.exports = {
  refreshAccessToken,
};
