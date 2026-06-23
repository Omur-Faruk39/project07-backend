const success = require("../../common/success.js");
const Error = require("../../common/error.js");
const friendModel = require("../../models/users/friendModel.js");
const notification = require("../../lib/notification.js");

const { getUserSocket } = require("../../config/websocket.js");

const sendFriendRequest = async (req, res) => {
  const data = {
    user_name_1: req.user.username,
    user_name_2: req.body.userName,
  };

  try {
    const isSuccess = await friendModel.sendFriendRequest(data);

    if (isSuccess) {
      notification.addNotification({
        userName: data.user_name_1,
        type: "friend",
        title: "send you a friend request",
        userName2: data.user_name_2,
      });

      const targetSocket = getUserSocket(data.user_name_2);
      if (targetSocket) {
        targetSocket.emit("notification", {
          type: "friend_request",
          from: data.user_name_1,
          title: `${data.user_name_1} sent you a friend request`,
          timestamp: new Date().toISOString(),
        });
      }

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
      // ================== WebSocket Notification ==================
      const targetSocket = getUserSocket(data.user_name_2);
      if (targetSocket) {
        targetSocket.emit("notification", {
          type: "friend_request_accepted",
          from: data.user_name_1,
          title: `${data.user_name_1} accepted your friend request`,
          timestamp: new Date().toISOString(),
        });
      }
      // ===========================================================

      notification.addNotification({
        userName: data.user_name_1,
        type: "friend",
        title: "accepted your friend request",
        userName2: data.user_name_2,
      });

      return res.json(success(null, "Friend request accepted"));
    }
  } catch (error) {
    return res
      .status(500)
      .json(Error(error, "Failed to accept friend request"));
  }
};

const deleteFriend = async (req, res) => {
  const data = {
    user_name_1: req.user.username,
    user_name_2: req.body.userName,
  };

  try {
    const isSuccess = await friendModel.deleteFriend(data);

    if (isSuccess) {
      return res.json(success(null, "Friend deleted successfully"));
    } else {
      res
        .status(400)
        .json(Error("Friend not found or not accepted", "Failed to delete friend"));
    }
  } catch (error) {
    return res
      .status(500)
      .json(Error(error, "Failed to delete friend"));
  }
};

const getFriends = async (req, res) => {
  try {
    const friends = await friendModel.getFriends(req.user.username);
    return res.json(success(friends, "Friends retrieved successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(Error(error, "Failed to get friends"));
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriend,
  getFriends,
};
