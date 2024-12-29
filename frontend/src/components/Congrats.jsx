import Confetti from "@tholman/confetti";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";

const Congrats = () => {
  const navigate = useNavigate();
  const onTransferMore = () => {
    navigate("/transfer");
  };
  return (
    <>
      <Confetti total={99} />
      <div className="h-screen w-screen flex flex-col items-center">
        <Navbar />
        <main className="h-full w-1/2 flex flex-col justify-center items-center">
          <Heading
            step="04"
            heading="Yay! Your transfer is all set. Enjoy your music and have fun!"
          />
          {/* <div className="flex flex-col">
            <span className="tracking-tighter font-medium items-start text-gray-400 ">
              <code>04</code>
            </span>
            <h1 className="text-5xl font-bold tracking-tighter">
              Yay! Your transfer is all set. Enjoy your music and have fun!
            </h1>
          </div> */}
          <div
            onClick={onTransferMore}
            className="mt-10 p-2 outline outline-1 rounded-lg hover:bg-violet-600 hover:outline-none cursor-pointer transition-colors"
          >
            Transfer More
          </div>
        </main>
      </div>
    </>
  );
};

export default Congrats;
