import Navbar from "./Navbar";
import { FaYoutube, FaSpotify, FaApple } from "react-icons/fa";
import { useEffect, useState } from "react";
import DevBtn from "./Buttons/DevBtn";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import Heading from "./Heading";
import ConnectAccountCard from "./ConnectAccounts/";
import getAccessToken from "../utils/tokens";

const GetStarted = () => {
  const navigate = useNavigate();
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [toast, setToast] = useState({
    animationDelay: false,
    show: false,
  });
  const [toastData, setToastData] = useState({
    type: "info",
    message: "",
  });

  const handleShowToast = (type, message) => {
    setToastData((prev) => ({
      ...prev,
      type: type || "info",
      message: message,
    }));

    setToast((prev) => ({ ...prev, animationDelay: true, show: true }));

    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);

    setTimeout(
      () => setToast((prev) => ({ ...prev, animationDelay: false })),
      4000
    );
  };

  const onContinue = () => {
    if (!youtubeConnected || !spotifyConnected) {
      handleShowToast("error", "Atleast 2 services should be connected");
      return;
    }

    navigate("/transfer");
  };

  useEffect(() => {
    const yt_accessToken = getAccessToken("youtube");
    const spotify_accessToken = getAccessToken("spotify");
    const searchParams = new URLSearchParams(window.location.search);
    const ytConected = searchParams.get("youtubeConnected");
    const spotifyConnected = searchParams.get("spotifyConnected");

    if (yt_accessToken || ytConected) setYoutubeConnected(true);

    if (spotify_accessToken || spotifyConnected) setSpotifyConnected(true);
  }, []);

  // useEffect(() => {
  //   if (spotifyConnected && youtubeConnected) {
  //     handleShowToast("success", "Wohoo! Let's go and setup your transfer.");
  //     setTimeout(() => {
  //       navigate("/transfer");
  //     }, 5000);
  //   }
  // }, [spotifyConnected, youtubeConnected, navigate]);

  const onConnectYotube = () => {
    const url = import.meta.env.VITE_IS_DEV
      ? `${import.meta.env.VITE_DEV_API_URL}/auth/yt/login`
      : `${import.meta.env.VITE_PROD_API_URL}/auth/yt/login`;

    fetch(url, {
      method: "GET",
      headers: {
        identifier: sessionStorage.getItem("identifier"),
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        window.location.href = data.authUrl;
      })
      .catch((err) => console.log(err));
  };

  const onConnectSpotify = () => {
    window.location.href = import.meta.env.VITE_IS_DEV
      ? `${import.meta.env.VITE_DEV_API_URL}/auth/spotify/login`
      : `${import.meta.env.VITE_PROD_API_URL}/auth/spotify/login`;
  };
  return (
    <>
      <div className="sm:h-screen w-screen flex flex-col items-center">
        <Navbar />
        {toast.show && (
          <Toast
            type={toastData.type}
            message={toastData.message}
            visible={toast.animationDelay}
          />
        )}
        <main className="h-full sm:w-2/3 p-2 sm:p-0 flex flex-col justify-center items-center mt-10 sm:mt-0">
          <Heading step="01" heading="First we need to connect your accounts" />
          <div className="flex sm:flex-row flex-col justify-center items-stretch mt-10 gap-10">
            <ConnectAccountCard
              icon={<FaYoutube size={54} />}
              accountProvider="YouTube Music"
              isConnected={youtubeConnected}
              onConnect={onConnectYotube}
              className="flex-1"
            />
            <ConnectAccountCard
              icon={<FaSpotify size={54} />}
              accountProvider="Spotify"
              isConnected={spotifyConnected}
              onConnect={onConnectSpotify}
              className="flex-1"
            />
            <ConnectAccountCard
              icon={<FaApple size={54} />}
              accountProvider="Apple Music"
              isConnected={false}
              onConnect={() => {}}
              className="flex-1"
              disabled={true}
            />
          </div>
          <div
            onClick={onContinue}
            className="w-1/3 text-center cursor-pointer mt-10 text-lg p-2 outline-dashed outline-1 rounded-lg hover:bg-violet-600  hover:outline-none transition-colors"
          >
            Continue
          </div>
        </main>
      </div>

      {import.meta.env.VITE_IS_DEV && (
        <DevBtn
          do={() => {
            navigate("/transfer");
          }}
        />
      )}
    </>
  );
};

export default GetStarted;
