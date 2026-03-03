const db = require("../../config/db.js");

const register = async (data) => {
  const {
    email = null,
    full_name = null,
    uid = null,
    game_id_name = null,
    user_name = null,
    role = [],
    pic = null,
    phone,
    refer_code = null,
    bio = null,
    banner = null,
    fesid = null,
  } = data;

  try {
    const [rows] = await db.query("SELECT * FROM user WHERE phone = ?", [
      phone,
    ]);

    const roleJson = JSON.stringify(role);

    if (rows.length > 0) {
      const result = await db.query(
        `UPDATE user 
         SET email = ?, full_name = ?, uid = ?, game_id_name = ?, user_name = ?, 
             role = ?, pic = ?, refer = ?, bio = ?, banner = ?, fesid = ?, 
             played_match = 0, winned_match = 0, life_time_value = 0, isvarified = 0, 
             monthly_value = 0, created_time = CURRENT_TIMESTAMP, updated_time = CURRENT_TIMESTAMP
         WHERE phone = ?`,
        [
          email,
          full_name,
          uid,
          game_id_name,
          user_name,
          roleJson,
          pic,
          refer_code,
          bio,
          banner,
          fesid,
          phone,
        ],
      );
      return { action: "updated", result };
    } else {
      const result = await db.query(
        `INSERT INTO user 
         (email, full_name, uid, game_id_name, user_name, role, pic, phone, refer, bio, banner, fesid) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email,
          full_name,
          uid,
          game_id_name,
          user_name,
          roleJson,
          pic,
          phone,
          refer_code,
          bio,
          banner,
          fesid,
        ],
      );
      return { action: "inserted", result };
    }
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const registerPassword = async (phone, password, email) => {
  const data = await db.query(``);
 
};

const userExists = async (data, key) => {
  const [rows] = await db.query(
    `SELECT user_name, isvarified FROM user WHERE ${key} = ?`,
    data,
  );
  const user = rows[0];
  return Boolean(user && user.isvarified > 0);
};

module.exports = {
  register,
  userExists,
  registerPassword,
};
