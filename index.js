require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App run on port ${port}`);
});

mongoose.connect(process.env.CONNECTION_STR).then(() => {
  console.log("DB connected");
});
