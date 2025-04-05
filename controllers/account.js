const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const resetPassModel = require("../models/resetPasswordModel");
const ApiError = require("../utils/errors/ApiError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { message } = require("../utils/validation/userValidation");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

async function GetUserById(req, res, next) {
  try {
    const id = req.userId;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError("Invalid user ID format", 400));
    }
    const userFound = await userModel.findById(id, "-password");
    if (!userFound) {
      return next(new ApiError("User not found", 404));
    }
    const user = {
      username: userFound.name,
      emailphone: userFound.email || userFound.phone,
    };
    res.status(200).json({
      user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
}

async function changeUserPassword(req, res, next) {
  try {
    let id = req.userId;
    if (!mongoose.Types.ObjectId.isValid(String(id))) {
      return next(new ApiError("Invalid user ID format", 400));
    }
    const userFound = await userModel.findById(id);
    if (!userFound) {
      return next(new ApiError("User not found", 404));
    }
    const isMatched = await bcrypt.compare(
      req.body.oldPass?.trim(),
      userFound.password
    );
    if (!isMatched) return next(new ApiError("Check Your Credentials", 401));
    if (req.body.username?.trim()) {
      userFound.username = req.body.username?.trim();
    }
    if (
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        req.body.emailphone.toLowerCase()
      )
    ) {
      userFound.email = req.body.emailphone?.toLowerCase().trim();
    } else if (/^\+?[0-9]{11}$/.test(req.body.emailphone)) {
      userFound.phone = req.body.emailphone?.trim();
    } else {
      return next(new ApiError("Invalid email or phone format", 400));
    }
    const passwordRegex =
      /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    if (!passwordRegex.test(req.body.newPass?.trim())) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPass?.trim(), salt);
    if (req.body.newPass?.trim()) {
      userFound.password = hashedPassword;
    }
    console.log(req.body.address);

    if (req.body.address) {
      userFound.address = req.body.address.trim();
    }
    await userFound.save();
    res.json({ message: "Password Updated Successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(
        new ApiError("Validation error: Please check your input data.", 400)
      );
    } else if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError("Invalid format for inputs", 400));
    } else if (error.code === 11000) {
      return next(
        new ApiError(
          "Duplicate value error. Please ensure the field is unique.",
          400
        )
      );
    } else if (error.message) {
      return next(new ApiError(error.message, 500));
    }
  }
}

module.exports = {
  GetUserById,
  changeUserPassword,
};