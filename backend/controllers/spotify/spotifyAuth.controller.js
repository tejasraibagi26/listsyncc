const axios = require("axios");
const spotifyConfig = require("../../config/spotify.config");
const { logFactory, logType, status } = require("../../utils/logger");
const querystring = require("querystring");

const CLIENT_ID = spotifyConfig.clientId;
const CLIENT_SECRET = spotifyConfig.clientSecret;
const REDIRECT_URI = spotifyConfig.redirectUri;

const login = async (req, res) => {
  const identifier = req.headers.identifier;
  const logger = logFactory({
    logType: logType.api,
    fnName: "spotify-login",
    identifier,
  });

  logger.info({ eventStatus: status.started });
  const scopes =
    "playlist-read-private user-library-read playlist-modify-private playlist-modify-public";

  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: CLIENT_ID,
      scope: scopes,
      redirect_uri: REDIRECT_URI,
    }
  )}`;
  res.redirect(authUrl);
};

const callback = async (req, res) => {
  const identifier = req.headers.identifier;
  const logger = logFactory({
    logType: logType.api,
    fnName: "spotify-callback",
    identifier,
  });
  const code = req.query.code || null;

  logger.info({ eventStatus: status.started });
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = response.data;
    logger.info({ eventStatus: status.completed });
    res.json({ access_token });
  } catch (error) {
    console.error(error.response.data);
    logger.error({ error, message: "Token exchange failed" });
    res.status(400).json({ error: "Token exchange failed" });
  }
};

module.exports = {
  login,
  callback,
};
