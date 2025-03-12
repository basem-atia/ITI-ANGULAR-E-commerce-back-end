const router = require("express").Router();
const Controllers = require("../controllers/category");

router.route("/create").post(Controllers.create);

module.exports = router;
