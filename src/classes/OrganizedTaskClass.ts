import { pick } from "lodash";

import { OrganizedTaskModel, OrganizedTask } from "../models/organizedTask";
import { isValidDate } from "../util/dateFuncs";
import TaskClass from "./TaskClass";
import { Task } from "../models/task";
import { User } from "../models/users";

class OrganizedTaskClass {
  task: TaskClass;

  constructor() {
    this.task = new TaskClass();
  }

  async addTask(
    task: Task,
    finishDate: Date | string,
    path: string
  ): Promise<OrganizedTask> {
    if (!finishDate || !isValidDate(finishDate)) {
      const err = {
        code: "400",
        message: "Invalid date",
      };
      throw err;
    }
    const taskObj = new OrganizedTaskModel({
      task,
      path,
      finish_date: finishDate,
    });
    return taskObj.save();
  }

  async deleteTasks(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      const task = await OrganizedTaskModel.findByIdAndRemove(ids[i]);
      await this.task.delete(task.task.toString());
    }
  }

  async findByTaskIdAndDeleteTask(id: string): Promise<void> {
    await OrganizedTaskModel.findOneAndRemove({ task: id });
  }

  async getTasksCount(user: User): Promise<number> {
    const tasks = await this.task.getAllTasks(user);
    const count = await OrganizedTaskModel.where({
      path: /^simple-tasks/,
      task: { $in: [...tasks] },
    }).count();
    return count;
  }

  async getTasks(user: User): Promise<Array<Task>> {
    const tasks = await this.task.getAllTasks(user);
    const organizedTasks = await this.getTaskFromDB(tasks);

    const finalTasks = [];

    for (let i = 0; i < organizedTasks.length; i += 1) {
      finalTasks.push({
        ...pick(
          await this.task.getTaskDetails(organizedTasks[i].task.toString()),
          ["desc", "type"]
        ),
        ...pick(organizedTasks[i], ["_id", "path", "finish_date", "status"]),
      });
    }
    return finalTasks;
  }

  private async getTaskFromDB(
    tasks: Array<Task>
  ): Promise<Array<OrganizedTask>> {
    const taskIds = tasks.map((task) => task._id.toString());
    const organizedTasks = await OrganizedTaskModel.find({
      path: /^simple-tasks/,
      task: { $in: [...taskIds] },
    });
    return organizedTasks;
  }

  async updateTask(task: OrganizedTask & Task): Promise<OrganizedTask> {
    if (!isValidDate(task.finishDate)) {
      const err = {
        code: "400",
        message: "Invalid date",
      };
      throw err;
    }
    const updatedTask = await OrganizedTaskModel.findByIdAndUpdate(
      { _id: task._id },
      {
        finish_date: task.finishDate,
      }
    );
    return updatedTask;
  }
}

export default OrganizedTaskClass;
