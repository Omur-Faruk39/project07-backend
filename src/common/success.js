const success = (data, message = "Success") => {
  return {
    status: true,
    message,
    data,
  };
};

module.exports = success;
