import { Request, Response, Router } from "express";

import asyncMiddleware from "../middleware/async";
import UserClass from "../classes/UserClass";
import CapturedTaskClass from "../classes/CapturedClass";

const router = Router();

const userObj = new UserClass();
const capturedObj = new CapturedTaskClass();

router.post(
  "/add",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { email, tasks } = req.body;
      const user = await userObj.getUserId(email);
      const savedTasks = await capturedObj.createTask(user, tasks);
      const response = {
        result: "success",
        data: savedTasks,
      };
      res.send(response);
    }
  )
);

router.post(
  "/list",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;
      const user = await userObj.getUserId(email);
      const tasks = await capturedObj.getAllTasks(user);
      res.send(tasks);
    }
  )
);

router.post(
  "/edit",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { task } = req.body;
      const updatedTask = await capturedObj.updateTask(task);
      res.send(updatedTask);
    }
  )
);

router.post(
  "/delete",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { task } = req.body;
      await capturedObj.deleteTask(task);
      res.send({ result: "success" });
    }
  )
);

module.exports = router;
