import PropTypes from "prop-types";
import LoginButtons from "../Buttons/LoginButton";
import { FaCheckCircle } from "react-icons/fa";

const ConnectAccountCard = ({
  icon,
  accountProvider,
  isConnected,
  onConnect,
  className = "",
  disabled = false,
  loading = false,
}) => {
  return (
    <div
      className={`border border-gray-400 rounded-lg p-6 flex flex-col gap-5 ${className}`}
    >
      {icon}
      <p className="font-semibold">Connect your {accountProvider} account</p>
      <div className="flex-grow" />
      {!isConnected ? (
        <LoginButtons
          name={accountProvider}
          onButtonClick={onConnect}
          disabled={disabled}
          loading={loading}
        />
      ) : (
        <div className="w-full flex items-center justify-start gap-2">
          <FaCheckCircle className="text-green-400" />
          <p className="font-medium">Account connected</p>
        </div>
      )}
    </div>
  );
};

ConnectAccountCard.propTypes = {
  icon: PropTypes.element.isRequired,
  accountProvider: PropTypes.string.isRequired,
  isConnected: PropTypes.bool.isRequired,
  onConnect: PropTypes.func.isRequired,
  className: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default ConnectAccountCard;
