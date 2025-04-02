const express = require("express");
const cors = require("cors");
const app = express();
const routers = require("../routes");
app.use(cors());
app.use(express.json());
app.use("/api/category", routers.category);
app.use("/api/subCategory", routers.subCategory);
app.use("/api/product", routers.product);
app.use("/api/register", routers.register);
app.use("/api/login", routers.login);

// Middleware to handle errors globally
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({ error: err.message });
});

module.exports = app;
