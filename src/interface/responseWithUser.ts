import { Response } from "express";
import User from "./user";

interface ResponseWithUser extends Response {
  user: User;
}

export default ResponseWithUser;
