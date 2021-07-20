import { Request, Response, Router } from "express";
import { pick } from "lodash";

import asyncMiddleware from "../middleware/async";
import UserClass from "../classes/UserClass";

const router = Router();
const userObj = new UserClass();

router.post(
  "/",
  asyncMiddleware(async (req: Request, res: Response): Promise<Response> => {
    if (!(await userObj.getUserId(req.body.email))) {
      const user = await userObj.createUser(req.body);
      const token = user.getAuthToken();
      return res.header("x-auth-token", token).send({
        user: pick(user, ["_id", "username", "phoneNumber", "email"]),
      });
    }
    return res.status(400).send("User already registered");
  })
);

module.exports = router;
