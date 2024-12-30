import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const privacyPolicy = () => {
    navigate("/privacy-policy");
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
