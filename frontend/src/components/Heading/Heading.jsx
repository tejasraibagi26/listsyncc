import PropTypes from "prop-types";

const Heading = ({ step, heading, children }) => {
  return (
    <div className="flex flex-col">
      <span className="tracking-tighter font-medium items-start text-gray-400 ">
        <code>{step}</code>
      </span>
      <h1 className="sm:text-5xl text-2xl font-bold tracking-tighter">
        {heading}
      </h1>
      {children}
    </div>
  );
};

Heading.propTypes = {
  step: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  children: PropTypes.element,
};

export default Heading;
