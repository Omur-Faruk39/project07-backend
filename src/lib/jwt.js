const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.js");

function generateAccessToken(user) {
  const payload = {
    sub: user.phone,
    username: user.username,
    role: user.role || "user",
  };

  const options = {
    expiresIn: "60d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = {
  generateAccessToken,
  verifyToken,
};
