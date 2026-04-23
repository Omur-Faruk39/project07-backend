const db = require("../../config/db.js");
const { getUserModel } = require("./userModel.js");

const sendFriendRequest = async (data) => {
  const isUserExist = await getUserModel({ username: data.user_name_2 });

  if (!isUserExist[0]) {
    return false;
  } else if (data.user_name_2 === data.user_name_1) {
    return false;
  }

  try {
    await db.query(
      "INSERT INTO friend_request (user_name_1, user_name_2) VALUES (?, ?)",
      [data.user_name_1, data.user_name_2],
    );
    return true;
  } catch (error) {
    return false;
  }
};

const acceptFriendRequest = async (data) => {
  try {
    await db.query(
      "UPDATE friend_request SET status = 'accepted' WHERE user_name_1 = ? AND user_name_2 = ?",
      [data.user_name_1, data.user_name_2],
    );
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
};
