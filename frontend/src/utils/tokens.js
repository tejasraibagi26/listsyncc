const getAccessToken = (source) => {
  if (source === "youtube") return sessionStorage.getItem("yt_accessToken");

  if (source === "spotify")
    return sessionStorage.getItem("spotify_accessToken");
};

export default getAccessToken;
