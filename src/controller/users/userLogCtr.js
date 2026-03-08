const bcrypt = require("bcryptjs");

const reqbody = require("../../lib/reqbody");
const errorResponse = require("../../common/error.js");
const success = require("../../common/success.js");
const { loginSchema } = require("../../validation/login.js");
const loginModel = require("../../models/users/userLogModel");
const { generateAccessToken } = require("../../utils/jwt");

const login = async (req, res) => {
  // validate input
  const data = reqbody(req.body, loginSchema);
  if (data instanceof Error) {
    return res
      .status(400)
      .json(errorResponse(data.message, "Validation failed"));
  }

  // Normalize phone number
  if (data.phone.startsWith("+880")) {
    data.phone = data.phone.slice(4);
  } else if (data.phone.startsWith("880")) {
    data.phone = data.phone.slice(3);
  } else if (data.phone.startsWith("0")) {
    data.phone = data.phone.slice(1);
  }

  // find user by email or phone
  const user = await loginModel.login(data.email, data.phone);
  if (user instanceof Error) {
    return res.status(400).json(errorResponse(user.message, "Login failed"));
  }

  // compare password
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json(errorResponse("Invalid credentials", "Login failed"));
  }

  //to factor authentication can be implemented here (e.g. OTP, 2FA) before generating token
  //
  //
  //
  // login successful, generate JWT token
  const jwtToken = generateAccessToken({
    phone: user.phone,
    username: user.username,
    role: user.role,
  });

  res.json(success({ token: jwtToken }, "Login successful"));
};

module.exports = { login };
