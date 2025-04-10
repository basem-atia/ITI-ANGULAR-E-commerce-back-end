const router = require("express").Router();
const controllers = require("../controllers").product;

router.route("/create").post(controllers.create);
router.route("/getByIds").post(controllers.getByIds);
router.route("/getAllBySubCategry/:id").get(controllers.getBySubCategoryId);
router.route("/getByFilter").post(controllers.getByFilter);
router.route("/createCollection").get(controllers.createCollection);
router.route("").get(controllers.getAll);

router
  .route("/getAllByCategoryId/:id/:page")
  .get(controllers.getAllByCategoryId);

router.route("/:id").get(controllers.getById);

module.exports = router;
