import { Request, Response, Router } from "express";

import asyncMiddleware from "../middleware/async";
import OrganizedTaskClass from "../classes/OrganizedTaskClass";
import UserClass from "../classes/UserClass";

const router = Router();

const organizedTaskObj = new OrganizedTaskClass();
const userObj = new UserClass();

router.post(
  "/add",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { email, task } = req.body;
      const user = await userObj.getUserId(email);
      const organizedTask = await organizedTaskObj.organizeTask(task, user);
      const response = {
        result: "success",
        task: organizedTask,
      };
      res.send(response);
    }
  )
);

module.exports = router;
