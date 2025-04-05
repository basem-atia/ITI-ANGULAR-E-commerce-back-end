const router = require("express").Router();
const Controllers = require("../controllers").ordersSummary;
const verifyToken = require("../middlewares/verifyToken");
router.route("/getOrders").get(verifyToken, Controllers.getOrders);
module.exports = router;
