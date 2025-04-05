const Contact = require("../models/contact");

const submitContactForm = async (req, res) => {
  console.log(req.body);
  const { name, emailPhone, message } = req.body;
  try {
    const newContact = new Contact({
      name,
      emailPhone,
      message,
    });
    await newContact.save();
    res.status(201).json({
      message: "Contact form submitted successfully. We will get back to you soon.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = { submitContactForm }; 
