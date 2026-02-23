const Error = (error, message = "failed") => {
  return {
    status: "not ok",
    message,
    error,
  };
};

module.exports = Error;
