const routes = require("express").Router();
const success = require("../common/success.js");
const registrationCtr = require("../controller/users/registationCtr.js");
const registrationModel = require("../models/users/registationModel.js");
const { login } = require("../controller/users/userLogCtr.js");

// open routes
routes.post("/login", login);
routes.post("/register", registrationCtr.register);
routes.post("/varify-otp", registrationCtr.verifyOTP);

// developer routes (for testing, remove in production)
routes.post("/check-phone", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone is required" });
  }

  const exists = await registrationModel.userExists(phone, "phone");
  res.json({ success: true, exists });
});

module.exports = routes;
