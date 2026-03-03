const registrationModel = require("../../models/users/registationModel.js");
const { userSchema } = require("../../validation/ragistation.js");
const sanitize = require("../../utils/sanitize.js");
const success = require("../../common/success.js");
const ErrorResponse = require("../../common/error.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const registationCtr = {};

registationCtr.register = async (req, res) => {
  //validate and sanitize input
  let sanitizedData;
  try {
    sanitizedData = sanitize(req.body);
  } catch (err) {
    return res.status(400).json(ErrorResponse("Invalid input", err.message));
  }
  const { error, value } = userSchema.validate(sanitizedData);
  if (error) {
    return res
      .status(400)
      .json(ErrorResponse(error.details[0].message, "Validation failed"));
  }

  // Check for duplicates
  if (await registrationModel.userExists(value.phone, "phone")) {
    return res
      .status(400)
      .json(
        ErrorResponse("Phone number already registered", "Duplicate phone"),
      );
  }
  if (
    value.email &&
    (await registrationModel.userExists(value.email, "email"))
  ) {
    return res
      .status(400)
      .json(ErrorResponse("Email already exists", "Duplicate email"));
  }
  if (await registrationModel.userExists(value.uid, "uid")) {
    return res
      .status(400)
      .json(ErrorResponse("UID already taken", "Duplicate UID"));
  }
  if (await registrationModel.userExists(value.user_name, "user_name")) {
    return res
      .status(400)
      .json(ErrorResponse("Username already taken", "Duplicate username"));
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(value.password, salt);
  const fesid = uuidv4();

  while (await registrationModel.userExists(fesid, "fesid")) {
    fesid = uuidv4();
  }

  // console.log("Generated UUID:", id);
  // console.log("User data to be registered:", hash);

  try {
    const result = await registrationModel.register({ ...value, fesid });

    await registrationModel.registerPassword(value.phone, hash, value.email);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json(ErrorResponse("Server error", err.message));
  }
};

module.exports = registationCtr;
