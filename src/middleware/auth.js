const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.js");

const error = require("../common/error.js");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(
        error("Access Denied", "Authorization header missing or malformed."),
      );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET || "super-secret-jwt-key");
    req.user = decoded;
    next();
  } catch (err) {
    // console.error("Token verification failed:", err);
    return res
      .status(401)
      .json(error("Access Denied", "Invalid or expired token."));
  }
};

module.exports = verifyToken;
