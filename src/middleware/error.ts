import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

function error(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(err);
  res.status(500).send("Something failed");
}

export default error;
