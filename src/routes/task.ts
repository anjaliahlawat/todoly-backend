import { Request, Response, Router } from "express";

import asyncMiddleware from "../middleware/async";
import TaskClass from "../classes/TaskClass";
import CapturedTaskClass from "../classes/CapturedClass";

const router = Router();

const taskObj = new TaskClass();
const capturedObj = new CapturedTaskClass();

router.post(
  "/add",
  asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { task } = req.body;
      const organizedTask = await taskObj.addToSimpleTask(task);
      if (organizedTask) {
        await capturedObj.deleteTask(task._id);
        const response = {
          result: "success",
          task: organizedTask,
        };
        res.send(response);
      }
    }
  )
);

module.exports = router;
