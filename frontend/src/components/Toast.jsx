import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaFrownOpen,
} from "react-icons/fa";

const Toast = ({ message, type, visible }) => {
  const [css, setCss] = useState(null);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (type === "warning") {
      setCss("bg-orange-400");
      setIcon(<FaExclamationTriangle color="white" />);
      return;
    }

    if (type === "success") {
      setCss("bg-green-400");
      setIcon(<FaCheckCircle color="white" />);
      return;
    }

    if (type === "error") {
      setCss("bg-red-400");
      setIcon(<FaFrownOpen color="white" />);
      return;
    }

    setCss("bg-blue-400");
    setIcon(<FaInfoCircle color="white" />);
  }, [type]);
  return (
    <div
      className={`${css} bg-opacity-25 fixed right-4 top-20 sm:w-1/4 rounded-lg p-2 
        flex justify-start items-center gap-2 outline-dashed outline-1
        transition-all transform duration-500 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
    >
      <div>{icon}</div>
      <span>{message}</span>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
  visible: PropTypes.bool,
};
export default Toast;
