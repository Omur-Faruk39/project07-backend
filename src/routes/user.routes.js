const routes = require("express").Router();
const protectedRoutes = require("express").Router();
const success = require("../common/success.js");
const registrationModel = require("../models/users/registationModel.js");
const varifyToken = require("../middleware/auth.js");

//controllers
const friendCtr = require("../controller/users/friendCtr.js");
const { login } = require("../controller/users/userLogCtr.js");
const { getProfileCtr } = require("../controller/users/userCtr.js");
const registrationCtr = require("../controller/users/registationCtr.js");

// open routes
routes.post("/login", login);
routes.post("/register", registrationCtr.register);
routes.post("/varify-otp", registrationCtr.verifyOTP);

// protected routes
protectedRoutes.use(varifyToken);
protectedRoutes.get("/profile", getProfileCtr);
protectedRoutes.post("/send-friend-request", friendCtr.sendFriendRequest);

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
