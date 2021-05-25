import { Response } from "express";
import { User } from "../models/users";

interface ResponseWithUser extends Response {
  user: User;
}

export default ResponseWithUser;
