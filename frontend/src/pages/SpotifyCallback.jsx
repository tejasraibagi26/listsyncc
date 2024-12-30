import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isLoading) return;

    setIsLoading((prev) => !prev);
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const identifier = sessionStorage.getItem("identifier");
    const host = import.meta.env.VITE_IS_DEV
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_PROD_API_URL;

    const url = `${host}/auth/spotify/callback?code=${code}`;

    if (code) {
      fetch(url, {
        method: "GET",
        headers: {
          identifier: identifier,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          sessionStorage.setItem("spotify_accessToken", data.access_token);

          navigate("/get-started?spotifyConnected=true");
        })
        .catch((err) => {
          console.error("Error:", err);
          navigate("/get-started?youtubeConnected=false");
        });
    }
  }, [isLoading]);

  return <div>{isLoading ? "Loading..." : "Redirecting..."}</div>;
};

export default SpotifyCallback;
