import { pick } from "lodash";

import LaterTasks from "../modals/later";
import Task from "../interface/task";
import TaskClass from "./TaskClass";
import User from "../interface/user";

class LaterClass {
  task: TaskClass;

  constructor() {
    this.task = new TaskClass();
  }

  async addTaskInLaterModal(task: Task, user: User): Promise<Task> {
    let laterTaskObj;
    if (task.from === "captured") {
      laterTaskObj = new LaterTasks({ task: task._id, user });
    }
    if (task.from === "organized") {
      laterTaskObj = new LaterTasks({ organizedTask: task._id, user });
    }
    if (task.from === "project") {
      laterTaskObj = new LaterTasks({ project: task._id, user });
    }
    laterTaskObj = await laterTaskObj.save();
    return pick(laterTaskObj, "_id", "task");
  }

  async getLaterTaskCount(user: User): Promise<number> {
    const count = await LaterTasks.where({ user }).count();
    return count;
  }

  async getLaterTasks(user: User): Promise<Array<Task>> {
    const laterTasks = await LaterTasks.find({ user });
    return laterTasks;
  }
}

export default LaterClass;