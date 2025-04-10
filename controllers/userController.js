const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const resetPassModel = require("../models/resetPasswordModel");
const ApiError = require("../utils/errors/ApiError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { message } = require("../utils/validation/userValidation");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email,
    pass: process.env.pass,
  },
});

async function getusers(req, res, next) {
  try {
    const users = await userModel.find({});
    res.status(200).json({
      users,
      message: "Users Retreived Successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
}
async function createUser(req, res, next) {
  // console.log(req.body);
  try {
    let user = null;
    if (req.body.email) {
      user = await userModel.findOne({ email: req.body.email });
    }
    if (req.body.phone) {
      user = await userModel.findOne({ phone: req.body.phone });
    }
    if (user) {
      return next(new ApiError("Email or phone Already Exist", 400));
    }
    const created = new userModel(req.body);
    const createdUser = await created.save();
    // const tokenPayload = {
    //   username: createdUser.username,
    //   id: createdUser._id,
    //   loggedInAt: new Date().toISOString(),
    // };
    // const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    res.status(201).json({
      createdUser,
      // token,
      message: "User Created Successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
}
async function login(req, res, next) {
  try {
    const body = req.body;
    let user = null;
    if (body.email) {
      user = await userModel.findOne({ email: body.email });
    }
    if (body.phone) {
      user = await userModel.findOne({ phone: body.phone });
    }
    if (!user) {
      return next(new ApiError("check your credentials", 401));
    }
    const isMatched = await bcrypt.compare(body.password, user.password);
    if (!isMatched) {
      return next(new ApiError("check your credentials", 401));
    }
    const tokenPayload = {
      username: user.username,
      id: user._id,
      loggedInAt: new Date().toISOString(),
    };
    console.log(process.env.JWT_SECRET);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      message: "logged in successfully",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
}
async function GetUserById(req, res, next) {
  try {
    const id = req.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError("Invalid user ID format", 400));
    }
    const userFound = await userModel.findById(id, "-password");
    if (!userFound) {
      return next(new ApiError("User not found", 404));
    }
    const user = {
      username: userFound.username,
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
        req.body.emailphone
      )
    ) {
      userFound.email = req.body.emailphone?.trim();
    } else if (/^\+?[0-9]{11}$/.test(req.body.emailphone)) {
      userFound.phone = req.body.emailphone?.trim();
    } else {
      return next(new ApiError("Invalid email or phone format", 400));
    }
    if (req.body.newPass?.trim()) {
      userFound.password = req.body.newPass?.trim();
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

async function forgetPassword(req, res, next) {
  let id = req.userId;
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    return next(new ApiError("Invalid user ID format", 400));
  }
  const userFound = await userModel.findById(id);
  if (!userFound) {
    return next(new ApiError("User not found", 404));
  }
  const { email } = req.body;
  try {
    if (userFound.email) {
      if (userFound.email === email) {
        // send email
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        const resetRecord = new resetPassModel({
          email,
          resetToken,
          expiresAt,
        });
        await resetRecord.save();
      } else {
        return next(new ApiError("Invalid email provided", 400));
      }
    } else if (userFound.phone) {
      //send sms
    }
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
}
module.exports = {
  getusers,
  login,
  createUser,
  GetUserById,
  changeUserPassword,
  forgetPassword,
};
