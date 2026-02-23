const Joi = require("joi");

const phoneSchema = Joi.string()
  .pattern(/^(\+8801|01)[3-9][0-9]{8}$/)
  .messages({
    "string.empty": "মোবাইল নম্বর দিতে হবে",
    "string.pattern.base":
      "বাংলাদেশের বৈধ মোবাইল নম্বর দিন (যেমন: 01712345678 বা +8801712345678)",
  });

const userSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  full_name: Joi.string().max(150).required(),
  uid: Joi.number().integer().required(),
  game_id_name: Joi.string().max(50).required(),
  user_name: Joi.string().max(100).required(),
  role: Joi.array()
    .items(
      Joi.string().valid(
        "First Rusher",
        "Second Rusher",
        "Sniper",
        "Supporter",
        "Bomber",
        "All-Rounder",
      ),
    )
    .min(1)
    .required(),
  pic: Joi.string().optional(),
  phone: phoneSchema,
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
  refer_code: Joi.string().alphanum().max(20).optional(),
  bio: Joi.string().max(500).optional(),
  banner: Joi.string().optional(),
});

module.exports = {
  userSchema,
};
