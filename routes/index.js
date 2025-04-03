//unit of work
module.exports = {
  category: require("./category"),
  subCategory: require("./subCategory"),
  product: require("./product"),
  login: require("../Authentication/Login.Route"),
  register: require("../Authentication/Register.Route"),
};
