import * as config from "config";
import * as express from "express";
import startDB from "./startup/db";
import configRoutes from "./startup/routes";

const app = express();

if (!config.get("jwtPrivateKey")) {
  // eslint-disable-next-line no-console
  console.log("FATAL ERROR: private key not available");
  process.exit(1);
}

startDB();
configRoutes(app);

const port = process.env.PORT || 4000;
// eslint-disable-next-line no-console
const server = app.listen(port, () => console.log(`running on ${port}`));

module.exports = server;
