import {
  FaSyncAlt,
  FaFingerprint,
  FaMusic,
  FaCheckDouble,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Banner from "./Banner";

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = (e) => {
    e.preventDefault();

    navigate("/get-started");
  };
  return (
    <div className="sm:h-screen h-auto w-screen flex flex-col items-center">
      <Navbar />
      <main className="h-full sm:w-2/3 w-full p-10 sm:p-0 flex flex-col justify-center items-center sm:mt-0 mt-10">
        <div className="h-full w-full flex flex-col justify-center items-center">
          <h1 className="sm:text-6xl text-4xl text-center sm:text-start font-bold tracking-tighter">
            Transfer your songs with a{" "}
            <span className="underline underline-offset-8 decoration-violet-500 decoration-wavy">
              click
            </span>
          </h1>
          <p className="pt-10 sm:text-xl text-lg tracking-tight text-center text-gray-400">
            ListSyncc makes it easy to transfer and sync your playlists between
            apps
          </p>

          <div
            onClick={handleGetStarted}
            className="cursor-pointer mt-10 text-lg p-2 outline outline-1 rounded-lg hover:bg-violet-600  hover:outline-none transition-colors"
          >
            Let&apos;s get you started
          </div>
          <Banner
            text="ListSyncc does not store your access tokens. We
            ensure that all tokens are cleared as soon as you leave our site."
          />

          <div className="mt-10 w-full flex sm:flex-row flex-col justify-between sm:gap-10 gap-5 items-stretch">
            <div className="w-full flex flex-col justify-start items-start gap-4 border border-gray-400 rounded-lg p-6 hover:bg-white hover:bg-opacity-10">
              <FaFingerprint size={54} />
              <p className="cursor-default select-none mt-2 font-semibold">
                ListSyncc securely connects to your music accounts, ensuring
                your data remains safe while syncing playlists.
              </p>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-4 border border-gray-400 rounded-lg p-6 hover:bg-white hover:bg-opacity-10">
              <FaMusic size={54} />
              <p className="cursor-default select-none mt-2 font-semibold">
                Select your source and destination services, then choose the
                playlists you want to sync effortlessly in one go.
              </p>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-4 border border-gray-400 rounded-lg p-6 hover:bg-white hover:bg-opacity-10">
              <FaSyncAlt size={54} />
              <p className="cursor-default select-none mt-2 font-semibold">
                Click ‘Transfer’ and let ListSyncc handle the rest—sit back and
                enjoy your music seamlessly synced!
              </p>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-4 border border-gray-400 rounded-lg p-6 hover:bg-white hover:bg-opacity-10">
              <FaCheckDouble size={54} />
              <p className="cursor-default select-none mt-2 font-semibold">
                All done! If you have more playlists, just repeat the process.
                Now go enjoy your music!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
