const ParentConfiguration = require("./ParentConfiguration");

module.exports = {
  InsertBook: ParentConfiguration.Parent + "api/Book/InsertBook",
  GetBook: ParentConfiguration.Parent + "api/Book/GetBook",
  DeleteBook: ParentConfiguration.Parent + "api/Book/DeleteBook",
  UpdateBook: ParentConfiguration.Parent + "api/Book/UpdateBook",
};
