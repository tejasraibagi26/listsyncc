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

    const identifier = sessionStorage.getItem("identifier") || "test";
    if (code) {
      fetch("http://localhost:8080/auth/spotify/callback?code=" + code, {
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
