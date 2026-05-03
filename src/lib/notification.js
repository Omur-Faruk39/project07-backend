const reqbody = require("./reqbody");
const validation = require("../validation/notification.js");
const errorResponse = require("../common/error.js");
const notificationModel = require("../models/notification/notificationModel.js");

const addNotification = async (data) => {
  const reqBody = reqbody(data, validation.validationAddNotification);

  if (reqBody instanceof Error) {
    throw errorResponse(reqBody, "Invalid request body");
  }

  await notificationModel.addNotification({
    userName: reqBody.userName,
    type: reqBody.type,
    title: reqBody.title,
    userName2: reqBody.userName2,
    data: reqBody.data,
  });
};

module.exports = {
  addNotification,
};
