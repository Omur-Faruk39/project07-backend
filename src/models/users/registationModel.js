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

const registerPassword = async (data) => {
  const { email = null, phone, fesid = null, password } = data;

  try {
    const [rows] = await db.query(
      "SELECT * FROM password_user WHERE phone = ?",
      [phone],
    );

    if (rows.length > 0) {
      const result = await db.query(
        `UPDATE password_user 
         SET email = ?, password = ?, fesid = ?, updated_time = CURRENT_TIMESTAMP
         WHERE phone = ?`,
        [email, password, fesid, phone],
      );
      return { action: "updated", result };
    } else {
      const result = await db.query(
        `INSERT INTO password_user (email, phone, fesid, password) VALUES (?, ?, ?, ?)`,
        [email, phone, fesid, password],
      );
      return { action: "inserted", result };
    }
  } catch (error) {
    console.error("Error registering password:", error);
    throw error;
  }
};

const userExists = async (data, key) => {
  const [rows] = await db.query(
    `SELECT user_name, isvarified FROM user WHERE ${key} = ?`,
    data,
  );
  const user = rows[0];
  return Boolean(user && user.isvarified > 0);
};

const saveOTP = async (phone, otp, ip) => {
  console.log(phone);
  try {
    const [recentOtp] = await db.query(
      `SELECT created_at 
       FROM otp_verification 
       WHERE phone = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [phone],
    );
    if (recentOtp.length > 0) {
      const lastTime = new Date(recentOtp[0].created_at).getTime();
      const now = Date.now();

      if (now - lastTime < 180 * 1000) {
        throw new Error(
          "Please wait at least 3 minutes before requesting another OTP.",
        );
      }
    }

    // 2️⃣ Check daily limit (3 per IP per day)
    const [ipCount] = await db.query(
      `SELECT COUNT(*) as total 
       FROM otp_verification 
       WHERE ip_address = ?
       AND DATE(created_at) = CURDATE()`,
      [ip],
    );
    if (ipCount[0].total >= 3) {
      throw new Error("Daily OTP limit exceeded for this IP address.");
    }

    // 3️⃣ Set expiry (3 minutes)
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // 4️⃣ Insert OTP
    await db.query(
      `INSERT INTO otp_verification 
       (ip_address, phone, fesid, otp_code, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [ip, phone, "OTP_LOGIN", otp, expiresAt],
    );

    return { success: true };
  } catch (error) {
    // console.error("Error saving OTP:", error.message);
    throw error;
  }
};

const verifyOTP = async (phone, otp) => {
  const [rows] = await db.query(
    `SELECT * FROM otp_verification 
     WHERE phone = ? AND otp_code = ? AND expires_at > NOW() 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [phone, otp],
  );
  return rows.length > 0;
};

module.exports = {
  register,
  userExists,
  registerPassword,
  saveOTP,
  verifyOTP,
};
