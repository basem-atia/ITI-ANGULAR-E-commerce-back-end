const express = require("express");
const cors = require("cors");
const app = express();
const routers = require("../routes");
app.use(cors());
app.use(express.json());
app.use("/category", routers.category);
app.use("/subCategory", routers.subCategory);
app.use("/product", routers.product);

module.exports = app;
