const login = require("./LogIn.Controller");
const router = require("express").Router();

router.post("/", login);

module.exports = router;
