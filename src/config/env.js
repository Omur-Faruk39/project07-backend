const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  APP_PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "123456",
  DB_NAME: process.env.DB_NAME || "simple_hotel_management",
};
