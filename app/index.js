const express = require("express");
const app = express();
const routers = {
  category: require("../routes/category"),
};
app.use(express.json());
app.use("/category", routers.category);

module.exports = app;
