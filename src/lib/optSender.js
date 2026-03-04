const axios = require("axios");
const FormData = require("form-data");
const { OTP_SECRET_KEY, OTP_URL_ENDPOINT } = require("../config/env");

const otpSender = async (phone, otp) => {
  try {
    const formData = new FormData();
    formData.append("msg", `Your Free Esports OTP is ${otp}`);
    formData.append("api_key", OTP_SECRET_KEY);
    formData.append("to", phone);

    await axios
      .post(OTP_URL_ENDPOINT, formData, {
        headers: formData.getHeaders(),
      })
      .then((response) => {
        if (response.data.error) {
          console.error("Error sending OTP:", response.data);
          throw new Error("Failed to send OTP");
        }
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Failed to send OTP");
      });
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

module.exports = {
  otpSender,
};
