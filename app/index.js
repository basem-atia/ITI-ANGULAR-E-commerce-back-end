const express = require("express");
const cors = require("cors");
const app = express();
const routers = require("../routes");
app.use(cors());

app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  routers.order_payment
);

app.use(express.json());
app.use("/api/category", routers.category);
app.use("/api/subCategory", routers.subCategory);
app.use("/api/product", routers.product);
app.use("/api/register", routers.register);
app.use("/api/login", routers.login);
app.use("/api/profile/password", routers.password);
app.use("/api/profile", routers.account);
app.use("/api/payment", routers.order_payment);
app.use("/contact", routers.contact);
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({ error: err.message });
});

module.exports = app;
