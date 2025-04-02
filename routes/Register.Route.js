const register = require("../controllers/Register.Controller");
const router = require("express").Router();

router.post("/", register);

module.exports = router;
