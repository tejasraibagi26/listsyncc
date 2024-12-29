import PropTypes from "prop-types";
import { FaDev } from "react-icons/fa";

const DevBtn = (props) => {
  return (
    <div
      onClick={props?.do}
      className="absolute right-0 bottom-0 m-10 rounded-full w-10 h-10 bg-white flex justify-center items-center cursor-pointer"
    >
      <FaDev className="text-black" size={28} />
    </div>
  );
};

DevBtn.propTypes = {
  do: PropTypes.func,
};

export default DevBtn;
