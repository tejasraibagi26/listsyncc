const googleConfig = require("../config/google.config");
const { OAuth2Client } = require("google-auth-library");

const oauth2Client = new OAuth2Client(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirectUri
);

module.exports = oauth2Client;
