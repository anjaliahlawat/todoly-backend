import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import Logger from "../startup/logging";

function error(
  err: ErrorRequestHandler | any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // console.log(err);
  Logger.error(err);
  if (err.isJoi) res.status(400).send(err.details[0].message);
  if (err.code) res.status(err.code).send(err.message);
  res.status(500).send("Something failed");
}

export default error;
