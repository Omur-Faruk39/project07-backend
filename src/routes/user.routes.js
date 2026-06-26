const routes = require("express").Router();
const protectedRoutes = require("express").Router();
const success = require("../common/success.js");
const errorResponse = require("../common/error.js");
const registrationModel = require("../models/users/registationModel.js");
const varifyToken = require("../middleware/auth.js");
const { generateSignedUrl } = require("../lib/supabaseStorage.js");

//controllers
const friendCtr = require("../controller/users/friendCtr.js");
const { login } = require("../controller/users/userLogCtr.js");
const userCtr = require("../controller/users/userCtr.js");
const registrationCtr = require("../controller/users/registationCtr.js");
const notificationsCtr = require("../controller/users/notificationsCtr.js");

// open routes
routes.post("/login", login);
routes.post("/register", registrationCtr.register);
routes.post("/varify-otp", registrationCtr.verifyOTP);

// protected routes
protectedRoutes.use(varifyToken);
protectedRoutes.get("/profile", userCtr.getProfileCtr);
protectedRoutes.get("/user-profile", userCtr.getUserProfile);
protectedRoutes.post("/send-friend-request", friendCtr.sendFriendRequest);
protectedRoutes.post("/accept-friend-request", friendCtr.acceptFriendRequest);
protectedRoutes.post("/delete-friend", friendCtr.deleteFriend);
protectedRoutes.get("/friends", friendCtr.getFriends);

protectedRoutes.get("/notifications", notificationsCtr.getNotifications);

protectedRoutes.post("/upload-url", async (req, res) => {
  const { folder, ext } = req.body;

  if (!folder || !["pics", "banners"].includes(folder)) {
    return res
      .status(400)
      .json(errorResponse("Folder must be 'pics' or 'banners'", "Validation failed"));
  }
  if (!ext) {
    return res
      .status(400)
      .json(errorResponse("File extension is required", "Validation failed"));
  }

  const result = await generateSignedUrl(ext, folder);

  if (result.error) {
    return res.status(400).json(errorResponse(result.error, "Failed to generate upload URL"));
  }

  return res.json(success({
    signedUrl: result.signedUrl,
    publicUrl: result.publicUrl,
  }, "Upload URL generated"));
});

routes.use(protectedRoutes);
// developer routes (excluded from auth)
routes.post("/check-phone", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone is required" });
  }
  const exists = await registrationModel.userExists(phone, "phone");
  res.json({ success: true, exists });
});

module.exports = routes;
