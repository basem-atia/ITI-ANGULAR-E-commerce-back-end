const jwt = require("jsonwebtoken");
const ApiError = require("../utils/errors/ApiError");
async function protectMW(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return next(new ApiError("you are not authorized", 401));
    }
    const token = auth.split(" ")[1];
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payLoad;
    next();
  } catch (error) {
    return next(new ApiError("invalid or expired token", 401));
  }
}
module.exports = protectMW;
