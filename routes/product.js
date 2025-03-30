const router = require("express").Router();
const controllers = require("../controllers").product;

router.route("/create").post(controllers.create);
router.route("/getAllByCategoryId/:id").get(controllers.getAllByCategoryId);
router.route("/:id").get(controllers.getById);

module.exports = router;
