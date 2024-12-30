import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import YTCallback from "./pages/YoutubeCallback";
import GetStartedPage from "./pages/GetStarted";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import TransferPage from "./pages/Transfer";
import SpotifyCallback from "./pages/SpotifyCallback";
import SyncPlaylistsPage from "./pages/SyncPlaylists";
import CongratsPage from "./pages/CongratsPage";
import { TransferProvider } from "./Provider/TransferProvider";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const App = () => {
  useEffect(() => {
    const identifier = uuidV4();
    sessionStorage.setItem("identifier", identifier);
  }, []);
  return (
    <Router>
      <TransferProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/sync" element={<SyncPlaylistsPage />} />
          <Route path="/congrats" element={<CongratsPage />} />
          <Route path="/yt/callback" element={<YTCallback />} />
          <Route path="/spotify/callback" element={<SpotifyCallback />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </TransferProvider>
    </Router>
  );
};

export default App;
