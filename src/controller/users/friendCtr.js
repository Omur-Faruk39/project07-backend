const success = require("../../common/success.js");
const Error = require("../../common/error.js");
const friendModel = require("../../models/users/friendModel.js");
const notification = require("../../lib/notification.js");

const sendFriendRequest = async (req, res) => {
  const data = {
    user_name_1: req.user.username,
    user_name_2: req.body.userName,
  };

  try {
    const isSuccess = await friendModel.sendFriendRequest(data);

    if (isSuccess) {
      // add collumn for notification
      notification.addNotification({
        userName: data.user_name_1,
        type: "friend",
        title: "send you a friend request",
        userName2: data.user_name_2,
      });
      //
      //web socket notification

      //add notification

      return res.json({ success: true, message: "Friend request sent" });
    } else {
      res
        .status(400)
        .json(Error("request body invalid", "Failed to send friend request"));
    }
  } catch (error) {
    return res.status(500).json(Error(error, "Failed to send friend request"));
  }
};

const acceptFriendRequest = async (req, res) => {
  const data = {
    user_name_1: req.user.username,
    user_name_2: req.body.userName,
  };

  try {
    const isSuccess = await friendModel.acceptFriendRequest(data);

    if (isSuccess) {
      return res.json(success(null, "Friend request accepted"));
    }
  } catch (error) {
    return res
      .status(500)
      .json(Error(error, "Failed to accept friend request"));
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
};
