import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAccessToken from "../utils/tokens";

const YTCallback = () => {
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

    const url = `${host}/auth/yt/callback?code=${code}`;

    if (code) {
      fetch(url, {
        method: "GET",
        headers: {
          identifier: identifier,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const ytAccessToken = getAccessToken("youtube");
          if (ytAccessToken) {
            // update with new token
            sessionStorage.setItem("yt_accessToken", data.accessToken);

            navigate("/transfer?reauthenticated_yt=true");

            return;
          }
          sessionStorage.setItem("yt_accessToken", data.accessToken);

          navigate("/get-started?youtubeConnected=true");
        })
        .catch((err) => {
          console.error("Error:", err);
          navigate("/get-started?youtubeConnected=false");
        });
    }
  }, [isLoading]);

  return <div>{isLoading ? "Loading..." : "Redirecting..."}</div>;
};

export default YTCallback;
