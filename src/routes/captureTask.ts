import { Request, Response, Router } from "express";

import asyncMiddleware from "../middleware/async";
import auth from "../middleware/auth";
import CapturedTaskClass from "../classes/CapturedClass";
import TaskClass from "../classes/TaskClass";

const router = Router();

const capturedObj = new CapturedTaskClass();
const taskObj = new TaskClass();

router.post(
  "/add",
  auth,
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { user, tasks } = req.body;
    const addedTasks = await taskObj.createTask(tasks, user._id);
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
  auth,
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { user } = req.body;
    const createdTasks = await taskObj.getAllTasks(user._id);
    const capturedTasks = await capturedObj.getAllTasks(createdTasks);
    res.send(capturedTasks);
  })
);

router.post(
  "/edit",
  auth,
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { task } = req.body;
    const updatedTask = await taskObj.updateTask(task);
    res.send(updatedTask);
  })
);

router.post(
  "/delete",
  auth,
  asyncMiddleware(async (req: Request, res: Response): Promise<void> => {
    const { tasks } = req.body;
    await taskObj.deleteAll(tasks);
    await capturedObj.deleteAll(tasks);
    res.send({ result: "success" });
  })
);

module.exports = router;
