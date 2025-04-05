const paymentModel = require("../models").payment;
const orderModel = require("../models").order;
const dotenv = require("dotenv");
dotenv.config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function pay(req, res, next) {
  const { data, totalPrice, orderItems, method } = req.body.payload;
  try {
    if (method === "bank") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "usd",
        payment_method_types: ["card"],
      });
      const payment = new paymentModel({
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentIntentId: paymentIntent.id,
        status: "pending",
      });
      const items = orderItems.map((element) => ({
        name: element.name,
        quantity: element.quantity,
        price: element.price,
      }));
      const savedPayment = await payment.save();
      const order = new orderModel({
        userId: req.userId,
        items: items,
        payment: savedPayment._id,
        totalAmount: savedPayment.amount,
        orderStatus: "pending",
        shippingInfo: {
          address: data.address,
          city: data.city,
          country: data.country,
        },
      });
      const savedOrder = await order.save();
      return res
        .status(200)
        .json({ cash: "false", client_secret: paymentIntent.client_secret });
    } else if (method === "cash") {
      console.log("here cash");

      const payment = new paymentModel({
        amount: totalPrice,
        currency: "usd",
        paymentIntentId: "cash",
        status: "pending",
      });
      const items = orderItems.map((element) => ({
        name: element.name,
        quantity: element.quantity,
        price: element.price,
      }));
      const savedPayment = await payment.save();
      const order = new orderModel({
        userId: req.userId,
        items: items,
        payment: savedPayment._id,
        totalAmount: savedPayment.amount,
        orderStatus: "pending",
        shippingInfo: {
          address: data.address,
          city: data.city,
          country: data.country,
        },
      });
      const savedOrder = await order.save();
      return res.status(200).json({ cash: "true", client_secret: "" });
    } else {
      return res.status(400).json({ message: "check your inputs" });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("event: " + event);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  console.log(event.type);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log(paymentIntent.id);
    const paymentIntentId = paymentIntent.id;
    const updatedPayment = await paymentModel.findOneAndUpdate(
      {
        paymentIntentId,
      },
      {
        status: "succeeded",
      },
      {
        new: true,
      }
    );
    console.log(updatedPayment._id);
    await orderModel.findOneAndUpdate(
      { payment: updatedPayment._id },
      {
        orderStatus: "succeeded",
      }
    );
  }
  res.json({ received: true });
}
module.exports = { pay, stripeWebhook };
