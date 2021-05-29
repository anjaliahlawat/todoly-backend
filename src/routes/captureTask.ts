import { Request, Response, Router } from "express";

import asyncMiddleware from "../middleware/async";
import UserClass from "../classes/UserClass";
import CapturedTaskClass from "../classes/CapturedClass";
import TaskClass from "../classes/TaskClass";

const router = Router();

const userObj = new UserClass();
const capturedObj = new CapturedTaskClass();
const taskObj = new TaskClass();

router.post(
  "/add",
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { email, tasks } = req.body;
    const user = await userObj.getUserId(email);
    const addedTasks = await taskObj.createTask(tasks, user);
    const savedTasks = await capturedObj.add(addedTasks);
    const response = {
      result: "success",
      data: savedTasks,
    };
    res.send(response);
  })
);

router.post(
  "/list",
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const user = await userObj.getUserId(email);
    const createdTasks = await taskObj.getAllTasks(user);
    const capturedTasks = await capturedObj.getAllTasks(createdTasks);
    res.send(capturedTasks);
  })
);

router.post(
  "/edit",
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { task } = req.body;
    const updatedTask = await taskObj.updateTask(task);
    res.send(updatedTask);
  })
);

router.post(
  "/delete",
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { tasks } = req.body;
    await taskObj.deleteAll(tasks);
    await capturedObj.deleteAll(tasks);
    res.send({ result: "success" });
  })
);

module.exports = router;
