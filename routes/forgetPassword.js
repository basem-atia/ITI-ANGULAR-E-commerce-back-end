const router = require("express").Router();
const Controllers = require("../controllers").Password;
const verifyToken = require("../middlewares/verifyToken");

router.route("/forgetPassword").post(verifyToken, Controllers.forgetPassword);
router
  .route("/resetPasswordWithPhone")
  .post(verifyToken, Controllers.resetPasswordWithPhone);
router
  .route("/resetPasswordWithEmail")
  .post(verifyToken, Controllers.resetPasswordWithEmail);
module.exports = router;
