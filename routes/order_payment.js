const router = require("express").Router();
const Controllers = require("../controllers").order_payment;
const verifyToken = require("../middlewares/verifyToken");
router.route("/create-payment-intent").post(verifyToken, Controllers.pay);
router.route("/").post(Controllers.stripeWebhook);
module.exports = router;
