import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  const privacyPolicy = () => {
    window.open(
      "https://www.freeprivacypolicy.com/live/3dd3c358-7523-4ec3-8da6-1d18eddff877",
      "_blank"
    );
  };

  const repo = () => {
    window.open("https://github.com/tejasraibagi26/listsyncc", "_blank");
  };
  return (
    <div className="w-1/2 h-50 flex justify-between items-center pt-4">
      <h1 className="text-3xl font-bold tracking-tighter">
        ListSyncc<span className="text-violet-500">.</span>
      </h1>
      <div className="flex items-center gap-4 ">
        <div
          onClick={privacyPolicy}
          className="hover:underline underline-offset-4 cursor-pointer"
        >
          Privacy Policy
        </div>
        <div onClick={repo} className="cursor-pointer hover:text-violet-300">
          <FaGithub size={32} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
