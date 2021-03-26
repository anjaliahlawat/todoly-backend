const express = require("express");

const router = express.Router();
const _ = require("lodash");
const asyncMiddleware = require("../middleware/async");
const UserClass = require("../classes/UserClass");
const CapturedTaskClass = require("../classes/CapturedClass");

const userObj = new UserClass();
const capturedObj = new CapturedTaskClass();

router.post(
  "/create",
  asyncMiddleware(async (req, res) => {
    let { user: email, tasks } = req.body;
    tasks = JSON.parse(tasks);

    if (!email) {
      res.send("error");
    }

    const user = await userObj.getUserId(email);
    const savedTasks = await capturedObj.createTask(user, tasks);

    const response = {
      result: "success",
      data: savedTasks,
    };
    res.send(response);
  })
);

router.post(
  "/list",
  asyncMiddleware(async (req, res) => {
    const user = await userObj.getUserId(req.body.user);
    const tasks = await capturedObj.getAllTasks(user);

    res.send(tasks);
  })
);

router.post(
  "/delete",
  asyncMiddleware(async (req, res) => {
    const { task_id } = req.body;

    const task = await capturedObj.deleteTask(task_id);

    if (!task) return res.status(404).send("Not found");
    const response = {
      result: "success",
    };
    res.send(response);
  })
);

module.exports = router;
