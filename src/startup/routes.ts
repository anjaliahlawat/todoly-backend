import { json as expressJson } from "express";
import * as users from "../routes/users";
import * as auth from "../routes/auth";

const configRoutes = (app): void => {
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

export default configRoutes;