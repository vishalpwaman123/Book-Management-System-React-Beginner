const ParentConfiguration = require("./ParentConfiguration");

module.exports = {
  SignUp: ParentConfiguration.Parent + "api/Auth/SignUp",
  SignIn: ParentConfiguration.Parent + "api/Auth/SignIn",
};
