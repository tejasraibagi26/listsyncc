import PropTypes from "prop-types";
import { createContext, useState, useContext } from "react";

const TransferPlaylistContext = createContext();

export const TransferProvider = ({ children }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [source, setSource] = useState("youtube");
  const [destination, setDestination] = useState("spotify");

  const togglePlaylistSelection = (playlist) => {
    setSelectedPlaylists((prev) => {
      const isSelected = prev.some(
        (selected) => selected.playlist.id === playlist.playlist.id
      );
      if (isSelected) {
        return prev.filter(
          (selected) => selected.playlist.id !== playlist.playlist.id
        );
      } else {
        return [...prev, playlist];
      }
    });
  };

  const handleSelectAll = (playlists) => {
    if (selectedPlaylists.length === playlists.length) setSelectedPlaylists([]);
    setSelectedPlaylists(playlists);
  };

  const updateSource = (source) => {
    console.log(source.toLowerCase().replace(/\s+/g, ""));
    setSource(() => source.toLowerCase().replace(/\s+/g, ""));
  };

  const updateDestination = (destination) => {
    console.log(destination.toLowerCase().replace(/\s+/g, ""));
    setDestination(() => destination.toLowerCase().replace(/\s+/g, ""));
  };

  return (
    <TransferPlaylistContext.Provider
      value={{
        selectedPlaylists,
        source,
        destination,
        setSelectedPlaylists,
        togglePlaylistSelection,
        handleSelectAll,
        updateSource,
        updateDestination,
      }}
    >
      {children}
    </TransferPlaylistContext.Provider>
  );
};

TransferProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export const useTransfer = () => useContext(TransferPlaylistContext);
