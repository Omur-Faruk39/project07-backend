const success = (data, message = "Success") => {
  return {
    status: "ok",
    message,
    data,
  };
};

module.exports = success;
