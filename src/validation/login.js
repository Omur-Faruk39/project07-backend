const Joi = require("joi");

const phoneSchema = Joi.string()
  .pattern(/^(\+8801|01)[3-9][0-9]{8}$/)
  .messages({
    "string.empty": "মোবাইল নম্বর দিতে হবে",
    "string.pattern.base":
      "বাংলাদেশের বৈধ মোবাইল নম্বর দিন (যেমন: 01712345678 বা +8801712345678)",
  });

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  phoneNumber: phoneSchema,
  password: Joi.string().min(6).max(255).required(),
}).xor("username", "phoneNumber");

module.exports = {
  loginSchema,
};
