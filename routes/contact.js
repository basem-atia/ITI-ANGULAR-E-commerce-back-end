const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../controllers/contact");

router.post("/", submitContactForm);
// router.get("/", function () {
//   console.log("getting data");
// });
// router.use("abc").get(function (req, res) {
//   res.send("abc");
// });
module.exports = router;
