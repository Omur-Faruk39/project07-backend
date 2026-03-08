const registrationModel = require("../../models/users/registationModel.js");
const {
  userSchema,
  otpVerificationSchema,
} = require("../../validation/ragistation.js");
const sanitize = require("../../utils/sanitize.js");
const success = require("../../common/success.js");
const ErrorResponse = require("../../common/error.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { otpSender } = require("../../lib/optSender.js");
const { deepTrim } = require("../../lib/trim.js");
const reqbody = require("../../lib/reqbody.js");
const { login } = require("../../models/users/userLogModel.js");
const { generateAccessToken } = require("../../utils/jwt.js");

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

  // Normalize phone number
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
  //validate and sanitize input
  const data = reqbody(req.body, otpVerificationSchema);
  if (data instanceof Error) {
    return res
      .status(400)
      .json(ErrorResponse(data.message, "Validation failed"));
  }

  // Normalize phone number
  if (data.phone.startsWith("+880")) {
    data.phone = data.phone.slice(4);
  } else if (data.phone.startsWith("880")) {
    data.phone = data.phone.slice(3);
  } else if (data.phone.startsWith("0")) {
    data.phone = data.phone.slice(1);
  }

  try {
    // otp verify
    const isvarified = await registrationModel.verifyOTP(data.phone, data.otp);

    if (isvarified) {
      //get user details and generate token
      const user = await login("", data.phone);
      const jwtToken = generateAccessToken({
        phone: user.phone,
        username: user.username,
        role: user.role,
      });

      //varify user and send response
      const varifyResult = await registrationModel.varifyUser(data.phone);
      if (varifyResult instanceof Error) {
        return res
          .status(500)
          .json(
            ErrorResponse("User verification failed", varifyResult.message),
          );
      }
      res.status(200).json(success({ token: jwtToken }, "OTP verified"));
    } else {
      res
        .status(400)
        .json(
          ErrorResponse("Invalid or expired OTP", "OTP verification failed"),
        );
    }
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json(ErrorResponse("Server error", err.message));
  }
};

module.exports = registationCtr;
