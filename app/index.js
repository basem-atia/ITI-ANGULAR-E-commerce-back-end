const express = require("express");
const cors = require("cors");
const app = express();
const routers = {
  category: require("../routes/category"),
};
app.use(cors());
app.use(express.json());
app.use("/category", routers.category);

module.exports = app;
