import { FaCheckCircle } from "react-icons/fa";
import Navbar from "./Navbar";
import { ThreeDots } from "react-loader-spinner";
import { useTransfer } from "../Provider/TransferProvider";
import { useEffect, useState } from "react";
import DevBtn from "./Buttons/DevBtn";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import getAccessToken from "../utils/tokens";
import Banner from "./Banner";

const SyncPlaylist = () => {
  const { selectedPlaylists, source, destination, setSelectedPlaylists } =
    useTransfer();
  const navigate = useNavigate();
  const [completePlaylists, setCompletedPlaylists] = useState([]);
  const [transferDone, setTransferDone] = useState(false);

  useEffect(() => {
    if (transferDone) {
      setTimeout(() => {
        navigate("/congrats");
      }, 1000);
    }
  }, [transferDone]);

  const moveToCompleted = (playlistId) => {
    setSelectedPlaylists((prevSelected) =>
      prevSelected.filter((playlistItem) => {
        if (playlistItem.playlist.id === playlistId) {
          setCompletedPlaylists((prevCompleted) => [
            ...prevCompleted,
            playlistItem,
          ]);
          return false;
        }
        return true;
      })
    );
  };

  useEffect(() => {
    const accessToken = getAccessToken(destination);

    const host = import.meta.env.VITE_IS_DEV
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_PROD_API_URL;

    const url = `${host}/${destination}/transfer/${source}?accessToken=${accessToken}`;

    for (const playlist of selectedPlaylists) {
      fetch(url, {
        method: "POST",
        body: JSON.stringify([playlist]),
        headers: {
          "Content-Type": "application/json",
          identifier: sessionStorage.getItem("identifier"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          data.transferCompleted.forEach((completed) => {
            moveToCompleted(completed.playlist.id);
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    }

    setTransferDone(true);
  }, []);

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center">
        <Navbar />
        <main className="h-full sm:w-1/2 p-8 sm:p-0 flex flex-col justify-center items-center">
          <Heading
            step="03"
            heading="Sit back and relax, while we sync your playlists"
          />
          <Banner
            type="warning"
            text="This process may take a while. Please
              keep this window open, but feel free to browse while you wait."
          />
          <div className="w-full h-2/3 flex sm:flex-row flex-col  gap-4 justify-center mt-10">
            <div className="h-3/4 overflow-scroll sm:w-1/2 bg-gray-600 bg-opacity-25 rounded-lg p-4">
              <h1 className="font-bold tracking-tighter text-2xl mb-1">
                Transferring
              </h1>
              <div className="max-h-1/3 overflow-scroll p-2">
                {selectedPlaylists?.map((data) => {
                  return (
                    <div key={data.playlist.id} id={data.playlist.id}>
                      <div className="font-semibold text-lg text-ellipsis overflow-clip bg-black bg-opacity-25 mb-2 p-2 rounded-lg">
                        {data.playlist.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center items-center">
              {transferDone ? (
                <FaCheckCircle size={24} />
              ) : (
                <div className="rotate-90 sm:rotate-0">
                  <ThreeDots color="white" height={100} width={30} />
                </div>
              )}
            </div>
            <div className="h-3/4 overflow-scroll  sm:w-1/2 bg-gray-600 bg-opacity-25 rounded-lg p-4">
              <h1 className="font-bold tracking-tighter text-2xl mb-1">
                Completed
              </h1>
              <div>
                {completePlaylists?.map((data) => {
                  return (
                    <div key={data.playlist.id} id={data.playlist.id}>
                      <div className="font-semibold text-lg text-ellipsis overflow-clip bg-black bg-opacity-25 mb-2 p-2 rounded-lg">
                        {data.playlist.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
      {import.meta.env.VITE_IS_DEV && (
        <DevBtn
          do={() => {
            navigate("/congrats");
          }}
        />
      )}
    </>
  );
};

export default SyncPlaylist;
