const success = require("../../common/success.js");
const ErrorResponse = require("../../common/error.js");
const registrationModel = require("../../models/users/registationModel.js");
const { userSchema } = require("../../validation/ragistation.js");
const sanitize = require("../../utils/sanitize.js");

const registationCtr = {};

registationCtr.register = async (req, res) => {
  try {
    req.body = sanitize(req.body);
  } catch (error) {
    return res
      .status(400)
      .json(ErrorResponse("Invalid input data", error.message));
  }

  const { error } = userSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json(ErrorResponse(error.details[0].message, "Validation failed"));
  }

  const result = await registrationModel.register(req);
};

module.exports = registationCtr;
