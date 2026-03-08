const db = require("../../config/db");

const login = async (email = "", phone = "") => {
  const [user] = await db.query(
    "SELECT * FROM password_user WHERE email = ? OR phone = ? AND isvarified != 0",
    [email, phone],
  );

  if (user.length === 0) {
    return new Error("Invalid credentials");
  }
  return user[0];
};

module.exports = { login };
