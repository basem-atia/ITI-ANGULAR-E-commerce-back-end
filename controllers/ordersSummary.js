const orderModel = require("../models/order");
const { message } = require("../utils/validation/userValidation");

async function getOrders(req, res, next) {
  const userId = req.userId;
  try {
    if (userId) {
      const orders = await orderModel
        .find({ userId })
        .populate("payment")
        .exec();
      console.log(orders[0].shippingInfo);

      if (!orders) {
        return res.status(400).json({ message: "no orders done yet" });
      }
      return res.status(200).json({ orders });
    }
  } catch (error) {
    return res.status(400).json({ message: "internal server error" });
  }
}
module.exports = { getOrders };
