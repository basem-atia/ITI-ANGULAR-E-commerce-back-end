const joi = require("joi");
const userSchema = joi.object({
  username: joi
    .string()
    .required()
    .min(3)
    .pattern(/^[a-zA-Z]+$/),
  email: joi
    .string()
    .optional()
    .allow(null, "")
    .pattern(/^\+?[0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  phone: joi
    .string()
    .optional()
    .allow(null, "")
    .pattern(/^(010|011|012|015)\d{8}$/),
  password: joi
    .string()
    .required()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ),
});

module.exports = userSchema;
