var customer = require("./controller/customer");
var user = require("./controller/user");

module.exports = function (app) {
  app.post("/addCustomer", customer.addCustomer);
  app.post("/updateCustomer", customer.updateCustomer);
  app.get("/search", customer.search);
  app.post("/signup", user.signup);
  app.post("/login", user.login);
};
