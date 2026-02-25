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

  const { error, data } = userSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json(ErrorResponse(error.details[0].message, "Validation failed"));
  }

  const emailExists = await registrationModel.userExists(
    req.body.email,
    "email",
  );
  if (emailExists) {
    return res
      .status(400)
      .json(ErrorResponse("Email already exists", "Duplicate email"));
  }
  const phoneExists = await registrationModel.userExists(
    req.body.phone,
    "phone",
  );
  if (phoneExists) {
    return res
      .status(400)
      .json(ErrorResponse("Phone number already exists", "Duplicate phone"));
  }
  const userNameExists = await registrationModel.userExists(
    req.body.user_name,
    "user_name",
  );
  if (userNameExists) {
    return res
      .status(400)
      .json(ErrorResponse("User name already exists", "Duplicate user name"));
  }

  const result = await registrationModel.register(data);

  return res.status(200).json(success("User registered successfully", result));
};

registationCtr.userNameUniq = async (req, res) => {
  const { user_name } = req.body;

  const userExists = await registrationModel.userExists(user_name, "user_name");
  if (userExists) {
    return res
      .status(400)
      .json(ErrorResponse("User name already exists", "Duplicate user name"));
  }
  return res.status(200).json(success("User name is available", true));
};

module.exports = registationCtr;
