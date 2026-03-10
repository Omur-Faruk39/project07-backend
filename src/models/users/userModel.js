const db = require("../../config/db.js");

const getUserModel = async (user) => {
  const { phone, username } = user;

  const [profile] = await db.query(
    "SELECT full_name, dob, gender, phone, email, pic, banner, role, position, played_match, winned_match, life_time_value, monthly_value, lastmonth_value, uid, game_id_name, user_name, created_time FROM user WHERE phone = ? OR user_name = ?",
    [phone, username],
  );
  console.log(user);
  return profile;
};

module.exports = {
  getUserModel,
};
