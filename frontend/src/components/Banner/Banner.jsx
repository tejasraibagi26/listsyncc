import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaFrownOpen,
} from "react-icons/fa";

const Banner = ({ type, text }) => {
  const [icon, setIcon] = useState(null);
  const iconRef = useRef(icon);

  const [bgColor, setBgColor] = useState("bg-blue-400");

  useEffect(() => {
    let newIcon = <FaInfoCircle size={16} />;

    if (type === "warning") {
      newIcon = <FaExclamationTriangle size={16} />;
      setBgColor("bg-orange-400");
    }
    if (type === "error") {
      newIcon = <FaFrownOpen size={16} />;
      setBgColor("bg-red-400");
    }

    iconRef.current = newIcon;
    setIcon(newIcon);
  }, [type]);

  return (
    <>
      <span
        className={`p-2 rounded-lg outline-dashed outline-1 outline-gray-400 tracking-tight mt-5 font-medium flex justify-start items-center gap-2 ${bgColor} bg-opacity-25`}
      >
        {icon}
        {text}
      </span>
    </>
  );
};

Banner.propTypes = {
  type: PropTypes.string,
  text: PropTypes.any.isRequired,
};

export default Banner;
