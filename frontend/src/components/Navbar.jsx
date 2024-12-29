import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="w-1/2 h-50 flex justify-between items-center pt-4">
      <h1 className="text-3xl font-bold tracking-tighter">
        ListSyncc<span className="text-violet-500">.</span>
      </h1>
      <div className="cursor-pointer hover:text-violet-300">
        <FaGithub size={32} />
      </div>
    </div>
  );
};

export default Navbar;
