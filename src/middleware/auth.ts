import * as jwt from "jsonwebtoken";
import * as config from "config";
import { Request, NextFunction } from "express";

import ResponseWithUser from "../interface/responseWithUser";

function auth(
  req: Request,
  res: ResponseWithUser,
  next: NextFunction
): ResponseWithUser {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    res.user = decoded;
    next();
    return res.status(200);
  } catch (ex) {
    console.log(ex);
    return res.status(400).send("Invalid token.");
  }
}

export default auth;
