const Error = (error, message = "failed") => {
  return {
    status: false,
    message,
    error,
  };
};

module.exports = ErrorResponse = Error;
