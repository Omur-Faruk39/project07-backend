const db = require("../../config/db.js");

const register = async (data) => {
  const {
    email,
    full_name,
    uid,
    game_id_name,
    user_name,
    role,
    pic,
    phone,
    password,
    refer_code,
    bio,
    banner,
  } = data;

  try {
    const result = await db.query(
      "INSERT INTO user (email, full_name, uid, game_id_name, user_name, role, pic, phone, password, refer_code, bio, banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        full_name,
        uid,
        game_id_name,
        user_name,
        role,
        pic,
        phone,
        password,
        refer_code,
        bio,
        banner,
      ],
    );

    return result;
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

const userExists = async (data, key) => {
  const [result] = await db.query(`SELECT * FROM user WHERE ${key} = ?`, data);
  return Boolean(result[0]);
};

module.exports = {
  register,
  userExists,
};
