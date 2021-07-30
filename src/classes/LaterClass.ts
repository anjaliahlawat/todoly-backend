import { pick } from "lodash";

import { LaterTasksModel, LaterTask } from "../models/later";
import { Task } from "../models/task";
import TaskClass from "./TaskClass";
import { User } from "../models/users";

class LaterClass {
  task: TaskClass;

  constructor() {
    this.task = new TaskClass();
  }

  async addTaskInLaterModal(
    task: string,
    user: User,
    from: string
  ): Promise<Task> {
    let laterTaskObj;
    if (from === "captured" || from === "organized" || from === "awaiting") {
      laterTaskObj = new LaterTasksModel({ task, user });
    } else if (from === "project") {
      laterTaskObj = new LaterTasksModel({ project: task, user });
    }
    laterTaskObj = await laterTaskObj.save();
    return pick(laterTaskObj, "_id", "task");
  }

  async delete(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      const task = await LaterTasksModel.findByIdAndRemove(ids[i]);
      await this.task.delete(task.task.toString());
    }
  }

  async getLaterTaskCount(user: string): Promise<number> {
    const count = await LaterTasksModel.where({ user }).count();
    return count;
  }

  async getLaterTasks(user: string): Promise<Array<Task>> {
    const laterTasks = await LaterTasksModel.find({ user });

    const finalTasks = [];
    for (let i = 0; i < laterTasks.length; i += 1) {
      finalTasks.push({
        ...pick(await this.task.getTaskDetails(laterTasks[i].task.toString()), [
          "desc",
          "type",
        ]),
      });
    }
    return finalTasks;
  }

  async updateTask({
    _id,
    desc,
  }: {
    _id: string;
    desc: string;
  }): Promise<LaterTask> {
    const laterTask = await LaterTasksModel.findById(_id);
    const updatedTask = {
      _id: laterTask.task.toString(),
      desc,
    };
    await this.task.updateTask(updatedTask);
    return laterTask;
  }
}

export default LaterClass;
