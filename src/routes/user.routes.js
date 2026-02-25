const routes = require("express").Router();
const success = require("../common/success.js");
const registrationCtr = require("../controller/users/registationCtr.js");

routes.post("/login", (req, res) => {
  res.status(200).json(success("Login successful"));
});

routes.post("/register", registrationCtr.register);
routes.post("/check-username", registrationCtr.userNameUniq);

module.exports = routes;
