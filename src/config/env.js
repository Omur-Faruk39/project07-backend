const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  APP_PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "123456",
  DB_NAME: process.env.DB_NAME || "simple_hotel_management",
  OTP_SECRET_KEY: process.env.OTP_SECRET_KEY,
  OTP_URL_ENDPOINT: process.env.OTP_URL_ENDPOINT,
  JWT_SECRET: process.env.JWT_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || "profiles",
};
