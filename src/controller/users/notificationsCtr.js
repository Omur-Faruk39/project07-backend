const success = require("../../common/success.js");
const errorResponse = require("../../common/error.js");
const notification = require("../../lib/notification.js");

const getNotifications = async (req, res) => {
  try {
    const notifications = await notification.getNotifications(
      req.user.username,
    );

    // if (!notifications || notifications.length === 0) {
    //   return res.json(success([], "No notifications found"));
    // }

    return res.json(
      success({ id: notifications.nanoid }, "Notifications retrieved"),
    );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(error, "Failed to get notifications"));
  }
};

module.exports = {
  getNotifications,
};
