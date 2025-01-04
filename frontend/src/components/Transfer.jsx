import { useState } from "react";
import DevBtn from "./Buttons/DevBtn";
import Navbar from "./Navbar";
import getAccessToken from "../utils/tokens";
import { FaCheckCircle } from "react-icons/fa";
import { Audio } from "react-loader-spinner";
import Toast from "./Toast";
import { useTransfer } from "../Provider/TransferProvider";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import Banner from "./Banner";

const Transfer = () => {
  const navigate = useNavigate();
  const {
    togglePlaylistSelection,
    handleSelectAll,
    updateSource,
    updateDestination,
  } = useTransfer();

  const supportedPlatforms = {
    source: [
      { name: "YouTube", enabled: true, id: 1 },
      { name: "Spotify", enabled: false, id: 2 },
      { name: "Apple Music", enabled: false, id: 3 },
    ],
    destination: [
      { name: "Apple Music", enabled: false, id: 1 },
      { name: "Spotify", enabled: true, id: 2 },
    ],
  };

  const [youtubeTokenExpires, setYoutubeTokenExpired] = useState(false);
  const [blockFetch, setBlockFetch] = useState(false);

  const [fetching, setFetching] = useState(false);
  const [transferData, setTransferData] = useState({
    from: "YouTube",
    to: "Spotify",
    fromPlaylists: [],
    fetchError: null,
  });

  const [selectedPlaylist, setSelectedPlaylist] = useState([]);

  const [toast, setToast] = useState({
    animationDelay: false,
    show: false,
  });
  const [toastData, setToastData] = useState({
    type: "info",
    message: "",
  });

  const handleShowToast = (type, message) => {
    if (toast.show) return;
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

  const onUpdatePlatform = (e) => {
    const isFrom = e.target.id === "from";

    setTransferData((prev) => {
      const newPlatform = e.target.value;

      const updatedData = {
        ...prev,
        fromPlaylists: [],
        [isFrom ? "from" : "to"]: newPlatform,
      };

      if (isFrom && newPlatform === prev.to) {
        const availablePlatforms = supportedPlatforms.destination.filter(
          (platform) => platform !== newPlatform
        );
        updatedData.to = availablePlatforms[0];
      } else if (!isFrom && newPlatform === prev.from) {
        const availablePlatforms = supportedPlatforms.source.filter(
          (platform) => platform !== newPlatform
        );
        updatedData.from = availablePlatforms[0];
      }

      updateSource(updatedData.from);
      updateDestination(updatedData.to);
      return updatedData;
    });

    setSelectedPlaylist(() => []);
  };

  const fetchPlaylists = () => {
    if (blockFetch) {
      handleShowToast(
        "error",
        "Youtube API Qouta has exceeded, please try again later"
      );
      return;
    }
    setFetching((prev) => !prev);
    setYoutubeTokenExpired(false);

    const from = transferData.from.toLowerCase();

    const accessToken = getAccessToken(from);

    const host = import.meta.env.VITE_IS_DEV
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_PROD_API_URL;

    const url = `${host}/${from}/playlists?accessToken=${accessToken}`;

    fetch(url, {
      method: "GET",
      headers: {
        // identifers are used for logs and does not contain any user data. Its UUID to make logs unique to follow any errors on the server
        identifiers: sessionStorage.getItem("identifiers"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 401) {
          setYoutubeTokenExpired((prev) => !prev);
          throw {
            status: data.status,
            message:
              "It seems your token has expired. Please reauthenticate your YouTube Music account.",
          };
        }
        if (data.status === 403) {
          setBlockFetch(true);
          throw {
            status: data.status,
            message:
              "Looks like the request is not authorized or Youtube API Qouta has exceeded. Please try again in 24 hours.",
          };
        }
        if (data.length === 0 || !data) {
          setTransferData((prev) => ({
            ...prev,
            fetchError: "Oops, we could'nt find any playlists.",
          }));
          handleShowToast("error", "Oops, we could'nt find any playlists.");
          return;
        }
        setTransferData((prev) => ({ ...prev, fromPlaylists: data }));
        handleShowToast("success", "Retrieved data");
      })
      .catch((error) => {
        handleShowToast(
          "error",
          `${error.message || "Oops, looks like something is wrong"}`
        );
      })
      .finally(() => setFetching((prev) => !prev));
  };

  const onStartTransfer = () => {
    if (selectedPlaylist.length === 0) {
      handleShowToast(
        "error",
        "Please select at least one playlist to continue."
      );

      return;
    }

    navigate("/sync");
  };

  const onSelectAll = () => {
    if (selectedPlaylist.length === transferData.fromPlaylists.length) {
      // Deselect all if all are already selected
      setSelectedPlaylist([]);
    } else {
      // Select all if none or some are selected
      const allPlaylists = transferData.fromPlaylists.map(
        (playlist) => playlist
      );
      setSelectedPlaylist(allPlaylists);
      handleSelectAll(allPlaylists);
    }
  };

  const onSelectPlaylist = (e) => {
    const playlistId = e.target.id;

    const playlist = transferData.fromPlaylists.find(
      (list) => list.playlist.id === playlistId
    );

    togglePlaylistSelection(playlist);

    setSelectedPlaylist((prev) => {
      // If the playlist is already selected, remove it
      if (prev.some((selected) => selected.playlist.id === playlistId)) {
        return prev.filter((selected) => selected.playlist.id !== playlistId);
      }

      return [...prev, playlist];
    });
  };

  const handleRedirect = () => {
    window.open("https://spot-transfer.vercel.app/", "_blank");
  };

  const onReauthenticateYoutube = () => {
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

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center">
        <Navbar />
        <main className="h-full sm:w-2/3 p-10 sm:p-0 flex flex-col justify-center items-center ">
          <Heading
            step="02"
            heading="Select Your Source and Destination Platforms"
          >
            <Banner
              text={
                <p>
                  Unfortunately, we do not currently support transferring
                  playlists to YouTube directly. However, you can easily
                  transfer your playlists to YouTube Music using{" "}
                  <span
                    onClick={handleRedirect}
                    className="underline underline-1 underline-offset-4 cursor-pointer"
                  >
                    this
                  </span>{" "}
                  service instead.
                </p>
              }
            />
          </Heading>
          <div className="w-full flex sm:flex-row flex-col justify-center items-stretch mt-10 gap-10">
            <div className="sm:w-1/2 h-auto flex flex-col">
              <label className="pb-1">
                <code>Source</code>
              </label>
              <select
                name="from"
                id="from"
                value={transferData.from}
                className="w-full outline-dashed outline-1 outline-gray-400 rounded-lg p-4 focus:ring-0 ring-0 "
                onChange={onUpdatePlatform}
              >
                {supportedPlatforms.source.map((platform) => {
                  return (
                    platform.enabled && (
                      <option key={platform.id} value={platform.name}>
                        {platform.name}
                      </option>
                    )
                  );
                })}
              </select>
              {youtubeTokenExpires && (
                <Banner
                  type="error"
                  text={
                    <span>
                      Token expired. Please reauthenticate your{" "}
                      <span
                        className="underline underline-1 underline-offset-4 cursor-pointer"
                        onClick={onReauthenticateYoutube}
                      >
                        YouTube Music{" "}
                      </span>
                      account.
                    </span>
                  }
                />
              )}
            </div>

            <div className="sm:w-1/2 h-auto flex flex-col">
              <label className="pb-1">
                <code>Destination</code>
              </label>
              <select
                name="to"
                id="to"
                onChange={onUpdatePlatform}
                value={transferData.to}
                className="w-full outline-dashed outline-1 outline-gray-400 rounded-lg p-4 focus:ring-0 ring-0 "
              >
                {supportedPlatforms.destination.map((platform) => {
                  return (
                    platform.enabled && (
                      <option key={platform.id} value={platform.name}>
                        {platform.name}
                      </option>
                    )
                  );
                })}
              </select>
            </div>
          </div>
          <div
            onClick={
              transferData.fromPlaylists.length === 0
                ? fetchPlaylists
                : onStartTransfer
            }
            className={`cursor-pointer mt-10 text-lg tracking-tight p-2 outline  outline-1 rounded-lg hover:bg-violet-600 hover:outline-none transition-colors 
            } ${
              fetching && "bg-transparent hover:bg-transparent outline-none"
            }`}
          >
            {transferData.fromPlaylists.length === 0 ? (
              fetching ? (
                <Audio height={20} color="white" />
              ) : (
                `Fetch playlists from ${transferData.from}`
              )
            ) : (
              `Transfer to ${transferData.to}`
            )}
          </div>
          <div className="w-full max-h-2/3 overflow-scroll pr-2 pl-2">
            {transferData.fetchError && (
              <Banner type="error" text={<p>{transferData.fetchError}</p>} />
            )}
            {transferData.fromPlaylists.length !== 0 && (
              <div className="mt-10">
                <div className="mb-4 flex justify-between">
                  <code className="underline underline-offset-4 decoration-wavy">
                    Select playlists
                  </code>
                  <div
                    onClick={onSelectAll}
                    className="underline underline-1 underline-offset-4 decoration-dashed cursor-pointer"
                  >
                    {selectedPlaylist.length ===
                    transferData.fromPlaylists.length
                      ? "Deselect all"
                      : "Select all"}
                  </div>
                </div>
                {transferData?.fromPlaylists.flat().map((data) => {
                  const isSelected = selectedPlaylist.some(
                    (selected) => selected.playlist.id === data.playlist.id
                  );
                  return (
                    <div
                      onClick={onSelectPlaylist}
                      id={data.playlist.id}
                      key={data.playlist.id}
                      className={`h-[50px] outline-1 outline-gray-400 rounded-lg flex justify-between p-2 items-center mb-2 mt-2 cursor-pointer ${
                        isSelected
                          ? "outline bg-violet-600 bg-opacity-25"
                          : "outline-dashed"
                      }`}
                    >
                      <h1 id={data.id} className="text-lg font-medium">
                        {data.playlist.name}
                      </h1>
                      {isSelected && <FaCheckCircle />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      {toast.show && (
        <Toast
          message={toastData.message}
          type={toastData.type}
          visible={toast.animationDelay}
        />
      )}
      {import.meta.env.VITE_IS_DEV && (
        <DevBtn
          do={() => {
            navigate("/sync");
          }}
        />
      )}
    </>
  );
};

export default Transfer;
