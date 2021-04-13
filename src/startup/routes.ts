import { json as expressJson } from "express";

import * as auth from "../routes/auth";
import * as capturedTask from "../routes/captureTask";
import * as users from "../routes/users";
import error from "../middleware/error";

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
  app.use("/api/auth", auth);
  app.use("/api/capture-task", capturedTask);
  app.use("/api/register", users);
  app.use(error);
};

export default configRoutes;
