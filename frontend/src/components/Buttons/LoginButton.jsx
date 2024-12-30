import PropTypes from "prop-types";

const LoginButtons = (props) => {
  return (
    <div
      disabled={props.disabled}
      onClick={props.onButtonClick}
      className={`w-full bg-white text-black rounded-lg p-2 cursor-pointer hover:bg-opacity-75 transition-opacity ${
        props.disabled &&
        "cursor-not-allowed bg-grey-600 bg-opacity-30 text-white hover:bg-opacity-30"
      }`}
    >
      {props.disabled ? "Coming Soon" : `Connect to ${props.name}`}
    </div>
  );
};

LoginButtons.propTypes = {
  name: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default LoginButtons;
