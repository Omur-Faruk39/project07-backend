const friendModel = require("../../models/users/friendModel.js");

const sendFriendRequest = async (req, res) => {
  const data = {
    user_name_1: req.user.username,
    user_name_2: req.body.userName,
  };

  const isSuccess = await friendModel.sendFriendRequest(data);

  // console.log(isSuccess);

  if (isSuccess) {
    return res.json({ success: true, message: "Friend request sent" });
  } else {
    return res
      .status(500)
      .json({ success: false, message: "Failed to send friend request" });
  }
};

module.exports = {
  sendFriendRequest,
};
