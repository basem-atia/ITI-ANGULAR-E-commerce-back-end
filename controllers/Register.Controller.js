const userModel = require("../models/User");
const bcrypt = require("bcryptjs");

const Register = async (req, res) => {
  try {
    // console.log("Received data from frontend:", req.body);
    // Catch user info from request
    const { name, emailPhone, password, address } = req.body;
    // Convert emailPhone to lowercase
    const lowerEmailPhone = emailPhone.toLowerCase();
    // Search for this user in db
    const foundUser = await userModel.findOne({
      emailPhone: lowerEmailPhone,
    });
    // Check if user already exists
    if (foundUser) {
      return res
        .status(200)
        .json({ message: "Already exists, Please log in..." });
    }
    // Validate password before hashing
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user with hashed password
    const newUser = new userModel({
      name,
      emailPhone: lowerEmailPhone,
      password: hashedPassword,
      address: address || "",
    });

    await newUser.save();

    return res.status(201).json({ message: "Registered successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = Register;
