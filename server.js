// const express = require("express");
require("dotenv").config({ path: ".env" });
const port = process.env.port;
// const server = express();
const connectDb = require("./db");
// const userRouter = require("./routes/userRouter");
// const cors = require("cors");
// server.use(cors());
// server.use(express.json());
// server.use("/api/user", userRouter);
// server.use((err, req, res, next) => {
//   if (err) {
//     return res.status(err.statusCode).json({
//       error: err.message,
//     });
//   }
// });
connectDb();
server.listen(port, () => {
  console.log(`Server is running at Port: ${port}`);
});
