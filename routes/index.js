//unit of work
module.exports = {
  category: require("./category"),
  subCategory: require("./subCategory"),
  product: require("./product"),
  login: require("../Authentication/Login.Route"),
  register: require("../Authentication/Register.Route"),
  password: require("./forgetPassword"),
  order_payment: require("./order_payment"),
  account: require("./account"),
  ordersSummary: require("./ordersSummary"),
  contact: require("./contact"),
};
