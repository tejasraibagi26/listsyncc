require("dotenv").config();

module.exports = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.IS_DEV
    ? "http://localhost:3000/yt/callback"
    : process.env.PROD_YT_CALLBACK_URL,
};
