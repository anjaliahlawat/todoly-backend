const mongoose = require("mongoose");
var config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose.connect(db).then(() => console.log(`Connecting to ${db} ....`));
};
