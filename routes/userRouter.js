const userControllers = require("../controllers/userController");
const validationMW = require("../middlewares/userValidationMW");
const verifyToken = require("../middlewares/verifyToken");
const userRouter = require("express").Router();
userRouter.get("/", userControllers.getusers);
userRouter.post("/auth/login", userControllers.login);
userRouter.post("/auth/register", validationMW, userControllers.createUser);
userRouter.get("/profile", verifyToken, userControllers.GetUserById);
userRouter.put(
  "/profile/changepassword",
  verifyToken,
  userControllers.changeUserPassword
);
userRouter.post(
  "/profile/forgetPassword",
  verifyToken,
  userControllers.forgetPassword
);
module.exports = userRouter;
