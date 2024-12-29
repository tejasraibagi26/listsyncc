const logType = {
  api: "api",
  service: "service",
};

const status = {
  started: "started",
  failed: "failed",
  inProgress: "inProgress",
  completed: "completed",
};

const logFactory = ({ logType, fnName, indentifier }) => {
  return {
    info: ({ data = "", eventStatus = status.inProgress, message = "" }) => {
      console.log(
        `${new Date().toISOString()} | event=${fnName}.${logType}.${eventStatus} message=${message} data=${data} identifier=${indentifier}`
      );
    },
    error: ({ error = "", message = "" }) => {
      console.log(
        `${new Date().toISOString()} | event=${fnName}.${logType}.${
          status.error
        } message=${message} err=${error} identifier=${indentifier}`
      );
    },
  };
};

module.exports = {
  logFactory,
  logType,
  status,
};
