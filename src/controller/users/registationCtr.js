const registrationModel = require("../../models/users/registationModel.js");
const { userSchema } = require("../../validation/ragistation.js");
const sanitize = require("../../utils/sanitize.js");
const success = require("../../common/success.js");
const ErrorResponse = require("../../common/error.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { otpSender } = require("../../lib/optSender.js");
const { deepTrim } = require("../../lib/trim.js");

const registationCtr = {};

registationCtr.register = async (req, res) => {
  req.body = deepTrim(req.body);
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

  if (value.phone.startsWith("+880")) {
    value.phone = value.phone.slice(4);
  } else if (value.phone.startsWith("880")) {
    value.phone = value.phone.slice(3);
  } else if (value.phone.startsWith("0")) {
    value.phone = value.phone.slice(1);
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
    await registrationModel.register({ ...value, fesid });

    await registrationModel.registerPassword({
      phone: value.phone,
      password: hash,
      email: value.email,
      fesid,
    });

    const otp = Math.floor(100000 + Math.random() * 900000);
    await registrationModel.saveOTP(value.phone, otp, req.ip);
    await otpSender(
      `880${value.phone}`,
      `Your OTP for registration is: ${otp}`,
    );
    res
      .status(201)
      .json(
        success("User registered successfully", "User registered successfully"),
      );
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json(ErrorResponse("Server error", err.message));
  }
};

registationCtr.verifyOTP = async (req, res) => {
  req.body = deepTrim(req.body);
};

module.exports = registationCtr;
