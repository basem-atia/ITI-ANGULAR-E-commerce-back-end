const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const LogIn = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, phone, password } = req.body;

    const lowerEmail = email.toLowerCase();
    let foundUser = null;
    if (email) {
      foundUser = await userModel.findOne({ email: lowerEmail });
    }
    if (phone) {
      foundUser = await userModel.findOne({ phone: phone });
    }

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
      { id: foundUser._id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "3m" }
    );
    // Send JWT in response
    return res.status(200).json({
      message: "Logged in successfully.",
      token: dataJWT,
      user: {
        name: foundUser.name,
        email: foundUser.email,
        address: foundUser.address,
        phone: foundUser.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = LogIn;
