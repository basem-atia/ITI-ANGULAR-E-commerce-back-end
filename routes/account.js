const userControllers = require("../controllers/account");
const validationMW = require("../middlewares/userValidationMW");
const verifyToken = require("../middlewares/verifyToken");
const router = require("express").Router();
router.get("/getUser", verifyToken, userControllers.GetUserById);
router.put("/changepassword", verifyToken, userControllers.changeUserPassword);
module.exports = router;
