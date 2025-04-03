const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { message } = require("../utils/validation/userValidation");
const ApiError = require("../utils/errors/ApiError");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.header("authorization")?.split(" ")[1];
  if (!token) {
    return next(new ApiError("Access Denied:No Token provided", 401));
    // return res.status(401).json({ message: "Access Denied:No Token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return next(new ApiError("token is invalid", 403));
    // res.status(403).json({ message: "token is invalid" });
  }
}
module.exports = verifyToken;
