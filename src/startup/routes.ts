import { json as expressJson } from "express";
import users from "../routes/users";
import auth from "../routes/auth";
// const captureTask = require("../routes/captureTask");
// const organizeTask = require("../routes/organizeTask");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(expressJson());
  app.use("/api/register", users);
  app.use("/api/auth", auth);
  // app.use("/api/captured", captureTask);
  // app.use("/api/organize", organizeTask);
};
