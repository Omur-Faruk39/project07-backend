const success = require("../../common/success.js");
const errorResponse = require("../../common/error.js");
const notification = require("../../lib/notification.js");

const getNotifications = async (req, res) => {
  try {
    const notifications = await notification.getNotifications(req.user.username);
    return res.json(success(notifications, "Notifications retrieved"));
  } catch (error) {
    return res.status(500).json(errorResponse(error, "Failed to get notifications"));
  }
};

module.exports = {
  getNotifications,
};
