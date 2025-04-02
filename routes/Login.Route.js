const login = require("../controllers/LogIn.Controller");
const router = require("express").Router();

router.post("/", login);

module.exports = router;
