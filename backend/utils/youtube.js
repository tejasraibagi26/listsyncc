const { google } = require("googleapis");
const oauth2Client = require("./oAuthClient");

const youtubeClient = (accessToken) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  return youtube;
};

module.exports = youtubeClient;
