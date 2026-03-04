const axios = require("axios");
const FormData = require("form-data");
const { OTP_SECRET_KEY, OTP_URL_ENDPOINT } = require("../config/env");

const otpSender = async (phone, otp) => {
  try {
    const formData = new FormData();
    formData.append("smg", `Your Free Esports OTP is ${otp}`);
    formData.append("password", OTP_SECRET_KEY);
    formData.append("to", phone);

    axios
      .post(OTP_URL_ENDPOINT, formData, {
        headers: formData.getHeaders(),
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

module.exports = {
  otpSender,
};
