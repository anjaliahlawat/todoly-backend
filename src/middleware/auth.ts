import * as jwt from "jsonwebtoken";
import * as config from "config";

function auth(req, res, next): boolean {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    res.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
  return true;
}

export default auth;