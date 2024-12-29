import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "./Navbar";
import { ThreeDots } from "react-loader-spinner";
import { useTransfer } from "../Provider/TransferProvider";
import { useEffect, useState } from "react";
import DevBtn from "./Buttons/DevBtn";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import getAccessToken from "../utils/tokens";

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

    fetch(url, {
      method: "POST",
      body: JSON.stringify(selectedPlaylists),
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
        setTransferDone(true);
      })
      .catch((err) => {
        console.log("err", err);
      });
  });

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center">
        <Navbar />
        <main className="h-full w-1/2 flex flex-col justify-center items-center">
          <Heading
            step="03"
            heading="Sit back and relax, while we sync your playlists"
          >
            <span className="p-2 rounded-lg outline-dashed outline-1 outline-gray-400 tracking-tight mt-5 font-medium flex justify-start items-center gap-2 bg-orange-400 bg-opacity-25">
              <FaExclamationTriangle /> This process may take a while. Please
              keep this window open, but feel free to browse while you wait.
            </span>
          </Heading>
          <div className="w-full flex gap-4 justify-center mt-10">
            <div className="min-h-1/2 w-1/2 bg-gray-600 bg-opacity-25 rounded-lg p-4">
              <h1 className="font-bold tracking-tighter text-2xl mb-1">
                Transferring
              </h1>
              <div>
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
                <ThreeDots color="white" height={100} width={30} />
              )}
            </div>
            <div className="min-h-1/2  w-1/2 bg-gray-600 bg-opacity-25 rounded-lg p-4">
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
