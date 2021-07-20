import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

function error(
  err: ErrorRequestHandler | any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(err);
  if (err.isJoi) res.status(400).send(err.details[0].message);
  if (err.code) res.status(err.code).send(err.message);
  res.status(500).send("Something failed");
}

export default error;
