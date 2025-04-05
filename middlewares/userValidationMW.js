const ApiError = require("../utils/errors/ApiError");
const userSchema = require("../utils/validation/userValidation");

async function validationMW(req, res, next) {
  try {
    await userSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
}
module.exports = validationMW;
