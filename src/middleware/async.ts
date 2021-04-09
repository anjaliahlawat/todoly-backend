import { Request, Response, NextFunction, Handler } from "express";

export default (handler: Handler) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};
