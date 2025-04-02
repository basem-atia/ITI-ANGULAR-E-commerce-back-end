const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const LogIn = async (req, res) => {
  try {
    // Catch user info from request
    const { emailPhone, password } = req.body;
    // Convert emailPhone to lowercase
    const lowerEmailPhone = emailPhone.toLowerCase();
    // Search for this user in db
    const foundUser = await userModel.findOne({ emailPhone: lowerEmailPhone });
    // Check for email and password
    if (!foundUser)
      return res
        .status(400)
        .json({ message: "Invalid EmailPhone or Password" });

    const passTrue = await bcrypt.compare(password, foundUser.password);
    if (!passTrue)
      return res
        .status(400)
        .json({ message: "Invalid EmailPhone or Password" });

    // JWT before return
    // Create JWT and send in header to front
    const dataJWT = await jwt.sign(
      { id: foundUser._id, emailPhone: foundUser.emailPhone },
      process.env.JWT_SECRET
    );
    // Send JWT in response
    return res.status(200).json({
      message: "Logged in successfully.",
      token: dataJWT,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = LogIn;
