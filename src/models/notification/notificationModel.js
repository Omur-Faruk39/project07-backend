const db = require("../../config/db");

const addNotification = async (req) => {
  const { userName, type, title, userName2, data } = req;

  if (userName2 && data) {
    throw new Error("You cannot provide both userName2 and data.");
  }

  const finalUserName2 = userName2 || null;
  const finalData = data || null;

  const result = await db.query(
    "INSERT INTO notifications (user_name, type, title, user_name_2, data) VALUES (?, ?, ?, ?, ?)",
    [userName, type, title, finalUserName2, finalData],
  );
};

module.exports = {
  addNotification,
};
