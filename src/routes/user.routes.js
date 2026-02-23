const routes = require("express").Router();
const success = require("../common/success.js");

routes.post("/login", (req, res) => {
  res.status(200).json(success("Login successful"));
});

module.exports = routes;
