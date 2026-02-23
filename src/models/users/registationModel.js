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
  } = req.body;

  try {
    const result = await db.query("SELECT * FROM user");

    return result;
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

module.exports = {
  register,
};
