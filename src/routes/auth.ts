import { Router } from "express";
import asyncMiddleware from "../middleware/async";
import UserClass from "../classes/UserClass";

const router = Router();
const userObj = new UserClass();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    try {
      const token = await userObj.loginUser(req.body.email, req.body.password);
      if (!token) return res.status(400).send("Invalid email or password");

      res.send(token);
    } catch (error) {
      res.status(400).send(error);
    }
    return true;
  })
);

module.exports = router;
