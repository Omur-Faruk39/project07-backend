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

const deleteFriend = async (data) => {
  try {
    const result = await db.query(
      "DELETE FROM friend_request WHERE ((user_name_1 = ? AND user_name_2 = ?) OR (user_name_1 = ? AND user_name_2 = ?)) AND status = 'accepted'",
      [data.user_name_1, data.user_name_2, data.user_name_2, data.user_name_1],
    );
    return result.affectedRows > 0;
  } catch (error) {
    return false;
  }
};

const getFriends = async (username) => {
  try {
    const [rows] = await db.query(
      "SELECT user_name_2 AS friend FROM friend_request WHERE user_name_1 = ? AND status = 'accepted' UNION SELECT user_name_1 AS friend FROM friend_request WHERE user_name_2 = ? AND status = 'accepted' LIMIT 30",
      [username, username],
    );
    return rows;
  } catch (error) {
    return [];
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriend,
  getFriends,
};
