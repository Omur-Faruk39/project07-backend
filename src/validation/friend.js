const Joi = require("joi");

const friendRequestSchema = Joi.object({
  userName: Joi.string().max(100).required(),
});

module.exports = {
  friendRequestSchema,
};
