import { useEffect } from "react";

const YtPlaylist = () => {
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch(`http://localhost:8080/yt/playlists?accessToken=${accessToken}`)
      .then((resp) => resp.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, [accessToken]);

  return <div>playlists</div>;
};

export default YtPlaylist;
