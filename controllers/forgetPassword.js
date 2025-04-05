const jwt = require("jsonwebtoken");
const userModel = require("../models").user;
const resetPassModel = require("../models").resetPassword;
const ApiError = require("../utils/errors/ApiError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { message } = require("../utils/validation/userValidation");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendSms = require("./sendsms");
dotenv.config();
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email,
    pass: process.env.pass,
  },
});

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
        const foundRecord = await resetPassModel.findOne({ email: email });
        if (foundRecord) {
          return res
            .status(400)
            .json({ message: "an email is already sent to this gmail" });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        const resetRecord = new resetPassModel({
          email: email,
          resetToken,
          expiresAt,
        });
        await resetRecord.save();
        const resetLink = `http://localhost:4200/resetPasswordWithEmail/${resetToken}`;
        const mailOptions = {
          from: `"MyApp Support" <${process.env.Email}>`,
          to: userFound.email,
          subject: "Password Reset Request",
          html: `
                <h3>Password Reset Request</h3>
                <p>You requested to reset your password. Click the link below to proceed:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link is valid for 1 hour only.</p>
              `,
        };

        transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.status(500).json({ message: "Error in Sending Email" });
          }
          return res
            .status(200)
            .json({ message: "Password reset link sent to email" });
        });
      } else {
        return next(new ApiError("Invalid email provided", 400));
      }
    } else if (userFound.phone) {
      //send sms
      if (userFound.phone === email.slice(2)) {
        const foundRecord = await resetPassModel.findOne({
          phone: email.slice(2),
        });
        if (foundRecord) {
          return res
            .status(400)
            .json({ message: "an message is already sent to this number" });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        const resetRecord = new resetPassModel({
          phone: email.slice(2),
          resetToken,
          expiresAt,
        });
        await resetRecord.save();
        const smsResult = await sendSms(
          email,
          `Your password reset code is: ${resetToken}`
        );
        console.log("SMS Result:", smsResult);
        return res.status(200).json({ message: "Reset code sent via SMS" });
      } else {
        return next(new ApiError("Invalid phone provided", 400));
      }
    }
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
}
async function resetPasswordWithEmail(req, res, next) {
  const { newPassword, resetToken } = req.body;
  if (!newPassword || !resetToken) {
    return next(new ApiError("Token and new password are required", 400));
  }
  try {
    const resetRecord = await resetPassModel.findOne({ resetToken });
    if (!resetRecord) {
      return next(new ApiError("Expired Link", 400));
    }
    if (new Date() > resetRecord.expiresAt) {
      await resetPassModel.deleteOne({ resetToken });
      return next(new ApiError("Expired Link", 400));
    }
    let user = null;
    if (resetRecord.email) {
      user = await userModel.findOne({ email: resetRecord.email });
    } else if (resetRecord.phone) {
      user = await userModel.findOne({ phone: resetRecord.phone });
    }
    if (!user) {
      return next(new ApiError("user invalid", 400));
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    await resetPassModel.deleteOne({ resetToken });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return next(new ApiError("Internal Server Error", 500));
  }
}
async function resetPasswordWithPhone(req, res, next) {
  const { newPassword, code } = req.body;
  if (!newPassword || !code) {
    return next(new ApiError("code and new password are required", 400));
  }
  try {
    const resetRecord = await resetPassModel.findOne({ resetToken: code });
    if (!resetRecord) {
      return next(new ApiError("Expired Link", 400));
    }
    if (new Date() > resetRecord.expiresAt) {
      await resetPassModel.deleteOne({ resetToken });
      return next(new ApiError("Expired Link", 400));
    }
    let user = null;
    if (resetRecord.phone) {
      user = await userModel.findOne({ phone: resetRecord.phone });
    } else if (resetRecord.email) {
      user = await userModel.findOne({ email: resetRecord.email });
    }
    if (!user) {
      return next(new ApiError("user invalid", 400));
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    await resetPassModel.deleteOne({ resetToken: code });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return next(new ApiError("Internal Server Error", 500));
  }
}
module.exports = {
  forgetPassword,
  resetPasswordWithEmail,
  resetPasswordWithPhone,
};
