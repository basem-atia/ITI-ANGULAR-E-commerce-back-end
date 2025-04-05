const mongoose = require("mongoose");
// const validator = require("validators");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      match: /^[a-zA-Z ]+$/,
    },
    emailPhone: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (value) {
      //     return validator.isEmail(value) || validator.isMobilePhone(value);
      //   },
      //   message: "Invalid email or phone number.",
      // },
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
