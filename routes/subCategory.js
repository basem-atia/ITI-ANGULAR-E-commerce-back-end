const router = require("express").Router();
const controller = require("../controllers").subCategory;

router.route("/create").post(controller.create);
router.route("/getAllByCategoryId/:id").get(controller.getAllByCategoryId);

module.exports = router;
