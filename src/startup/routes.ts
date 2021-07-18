import { json as expressJson, Application } from "express";

import * as auth from "../routes/auth";
import * as capturedTask from "../routes/captureTask";
import * as task from "../routes/task";
import * as users from "../routes/users";
import error from "../middleware/error";

const configRoutes = (app: Application): void => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(expressJson());
  app.use("/api/auth", auth as Application);
  app.use("/api/capture-task", capturedTask as Application);
  app.use("/api/organize", task as Application);
  app.use("/api/register", users as Application);
  app.use(error);
};

export default configRoutes;
