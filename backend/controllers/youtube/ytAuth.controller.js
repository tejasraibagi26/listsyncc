const axios = require("axios");
const googleConfig = require("../../config/google.config");
const oauth2Client = require("../../utils/oAuthClient");
const { logFactory, logType, status } = require("../../utils/logger");

const callback = async (req, res) => {
  const identifier = req.headers.identifier;
  const logger = logFactory({
    logType: logType.api,
    fnName: "youtube-callback",
    identifier,
  });

  logger.info({ eventStatus: status.started });
  const { code } = req.query;
  if (!code) {
    logger.error({ error: "Authorization code missing" });
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    logger.info({ message: "fetching access token" });

    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: googleConfig.clientId,
      client_secret: googleConfig.clientSecret,
      redirect_uri: googleConfig.redirectUri,
      grant_type: "authorization_code",
    });
    logger.info({ message: "fetching access token complete" });
    const accessToken = data.access_token;

    logger.info({ eventStatus: status.completed });

    res.json({ accessToken });
  } catch (error) {
    logger.error({ error, message: "Failed to exchange authorization code" });
    res.status(500).json({ error: "Failed to exchange authorization code" });
  }
};

const login = async (req, res) => {
  const identifier = req.headers.identifier;
  const logger = logFactory({
    logType: logType.api,
    fnName: "youtube-login",
    identifier,
  });

  logger.info({ eventStatus: status.started });
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: ["https://www.googleapis.com/auth/youtube.readonly"],
  });

  logger.info({
    message: "redirecting to youtube login",
    eventStatus: status.completed,
  });
  res.json({ authUrl });
};

module.exports = {
  callback,
  login,
};
