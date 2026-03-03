const routes = require("express").Router();
const success = require("../common/success.js");
const registrationCtr = require("../controller/users/registationCtr.js");
const registrationModel = require("../models/users/registationModel.js");

routes.post("/login", (req, res) => {
  res.status(200).json(success("Login successful"));
});

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

routes.post("/register", registrationCtr.register);
// routes.post("/check-username", registrationCtr);

module.exports = routes;
