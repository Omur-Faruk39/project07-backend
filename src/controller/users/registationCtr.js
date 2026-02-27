const admin = require("../../config/firebaseAdmin.js"); // your init file
const registrationModel = require("../../models/users/registationModel.js");
const { userSchema } = require("../../validation/ragistation.js");
const sanitize = require("../../utils/sanitize.js");
const success = require("../../common/success.js");
const ErrorResponse = require("../../common/error.js");

const registationCtr = {};

registationCtr.register = async (req, res) => {
  try {
    req.body = sanitize(req.body);
  } catch (err) {
    return res.status(400).json(ErrorResponse("Invalid input", err.message));
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res
      .status(401)
      .json(ErrorResponse("ID token is required", "Authentication failed"));
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    console.error("Invalid/expired Firebase token", err);
    return res
      .status(401)
      .json(ErrorResponse("Invalid or expired token", "Authentication failed"));
  }

  const verifiedPhone = decodedToken.phone_number;

  const payload = {
    ...req.body,
    phone: verifiedPhone,
  };

  const { error, data } = userSchema.validate(payload, { allowUnknown: true });
  if (error) {
    return res
      .status(400)
      .json(ErrorResponse(error.details[0].message, "Validation failed"));
  }

  if (await registrationModel.userExists(data.phone, "phone")) {
    return res
      .status(400)
      .json(
        ErrorResponse("Phone number already registered", "Duplicate phone"),
      );
  }

  if (data.email && (await registrationModel.userExists(data.email, "email"))) {
    return res
      .status(400)
      .json(ErrorResponse("Email already exists", "Duplicate email"));
  }

  if (await registrationModel.userExists(data.user_name, "user_name")) {
    return res
      .status(400)
      .json(ErrorResponse("Username already taken", "Duplicate username"));
  }

  const firebaseUid = decodedToken.uid;

  try {
    const userData = {
      email: data.email,
      full_name: data.full_name,
      uid: data.uid,
      game_id_name: data.game_id_name,
      user_name: data.user_name,
      role: data.role,
      pic: data.pic || null,
      phone: verifiedPhone,
      refer_code: data.refer_code || null,
      bio: data.bio || null,
      banner: data.banner || null,
    };

    const result = await registrationModel.register(userData);

    return res.status(201).json(
      success("User registered successfully", {
        userId: result.insertId,
        user_name: data.user_name,
        phone: verifiedPhone,
      }),
    );
  } catch (err) {
    console.error("registration failed error", err);
    return res
      .status(500)
      .json(ErrorResponse("Failed to create user", "Database error"));
  }
};

module.exports = registationCtr;
