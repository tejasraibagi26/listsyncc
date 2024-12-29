require("dotenv").config();

module.exports = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.IS_DEV
    ? "http://localhost:3000/spotify/callback"
    : process.env.PROD_SPOTIFY_CALLBACK_URL,
};
