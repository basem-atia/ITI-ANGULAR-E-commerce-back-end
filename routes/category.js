const router = require("express").Router();
const Controllers = require("../controllers/category");

router.route("/create").post(Controllers.create);
router.route("/getAll").get(Controllers.getAll);

module.exports = router;
