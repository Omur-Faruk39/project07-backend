const Joi = require("joi");

const validationAddNotification = Joi.object({
  userName: Joi.string().max(50).required(),
  type: Joi.string().valid("friend", "room pass").optional(),
  title: Joi.string().max(500).required(),
  userName2: Joi.string() // Conditional validation for user_name_2
    .max(50)
    .when("type", {
      is: Joi.valid("friend"),
      then: Joi.required(),
      otherwise: Joi.forbidden(), // disallow for other types
    }),
});

module.exports = {
  validationAddNotification,
};
