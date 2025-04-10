const userModel = require("../models/User");
const bcrypt = require("bcryptjs");

const Register = async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.email || userData.email.trim() === "") {
      userData.email = undefined;
    }
    if (!userData.phone || userData.phone.trim() === "") {
      userData.phone = undefined;
    }
    const { name, email, phone, password, address } = req.body;
    const lowerEmail = email?.toLowerCase();
    const foundUser = await userModel.findOne({
      email: lowerEmail,
    });
    if (foundUser) {
      return res
        .status(200)
        .json({ message: "Already exists, Please log in..." });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email: lowerEmail,
      phone: phone,
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
