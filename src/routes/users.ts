import { Router } from "express";
import { get as getConfigVar } from "config";
import _ from "lodash";
import { jwt as jwtSign } from "jsonwebtoken";

import asyncMiddleware from "../middleware/async";
import UserClass from "../classes/UserClass";

const router = Router();
const userObj = new UserClass();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    try {
      const user = await userObj.createUser(req.body);
      if (!user) return res.status(400).send("User already registered");

      const token = jwtSign({ _id: user._id }, getConfigVar("jwtPrivateKey"));

      res.header("x-auth-token", token).send({
        user: _.pick(user, ["_id", "username", "phoneNumber", "email"]),
      });
    } catch (error) {
      res.status(400).send(error);
    }
  })
);

module.exports = router;
