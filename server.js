require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Imports
const connectDB = require("./db");
const RegisterRoute = require("./routes/Register.Route");
const LoginRoute = require("./routes/Login.Route");

// Initialize app
const app = express();

// Middleware to convert JSON to JS object
app.use(express.json());

// Middleware to allow cross-origin requests from the frontend
app.use(cors());

//Using register and login routes
app.use("/api/reg", RegisterRoute);
app.use("/api/log", LoginRoute);

// Middleware to handle errors globally
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({ error: err.message });
});

// DB connection & Start Server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
