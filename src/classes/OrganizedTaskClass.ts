import { pick } from "lodash";

import { OrganizedTaskModel, OrganizedTask } from "../models/organizedTask";
import { isValidDate } from "../util/dateFuncs";
import TaskClass from "./TaskClass";
import { Task } from "../models/task";

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
      finishDate,
    });
    return taskObj.save();
  }

  async deleteTasks(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      const task = await OrganizedTaskModel.findByIdAndRemove(ids[i]);
      await this.task.delete(task.task.toString());
    }
  }

  async deleteOrgTask(_id: string): Promise<OrganizedTask> {
    return OrganizedTaskModel.findByIdAndRemove(_id);
  }

  async findByTaskIdAndDeleteTask(id: string): Promise<void> {
    await OrganizedTaskModel.findOneAndRemove({ task: id });
  }

  async getTasksCount(user: string): Promise<number> {
    const tasks = await this.task.getAllTasks(user);
    const count = await OrganizedTaskModel.where({
      path: /^simple-task/,
      task: { $in: [...tasks] },
    }).count();
    return count;
  }

  async getTasks(user: string): Promise<Array<Task>> {
    const tasks = await this.task.getAllTasks(user.toString());
    const organizedTasks = await this.getTaskFromDB(tasks);

    const finalTasks = [];

    for (let i = 0; i < organizedTasks.length; i += 1) {
      finalTasks.push({
        ...pick(
          await this.task.getTaskDetails(organizedTasks[i].task.toString()),
          ["desc", "type"]
        ),
        ...pick(organizedTasks[i], ["_id", "path", "finishDate", "status"]),
      });
    }
    return finalTasks;
  }

  async getTaskDetails(_id: string): Promise<OrganizedTask | Task> {
    const orgTask = await OrganizedTaskModel.findById(_id);
    const task = await this.task.getTaskDetails(orgTask.task.toString());
    return {
      ...pick(orgTask, ["_id", "finishDate", "path", "status"]),
      task: { ...pick(task, ["_id", "desc"]) },
    };
  }

  private async getTaskFromDB(
    tasks: Array<Task>
  ): Promise<Array<OrganizedTask>> {
    const taskIds = tasks.map((task) => task._id.toString());
    const organizedTasks = await OrganizedTaskModel.find({
      path: /^simple-task/,
      task: { $in: [...taskIds] },
    });
    return organizedTasks;
  }

  // async updatePath() {

  // }

  async updateTask(task: {
    _id: string;
    desc?: string;
    finishDate?: Date;
  }): Promise<Task | OrganizedTask> {
    let updatedTask: OrganizedTask;
    if (task.finishDate) {
      if (!isValidDate(task.finishDate)) {
        const err = {
          code: "400",
          message: "Invalid date",
        };
        throw err;
      }
      updatedTask = await OrganizedTaskModel.findByIdAndUpdate(
        { _id: task._id },
        {
          finishDate: task.finishDate,
        }
      );
    }

    if (task.desc) {
      updatedTask = await OrganizedTaskModel.findById(task._id);
      const newTask = {
        _id: updatedTask.task.toString(),
        desc: task.desc,
      };

      await this.task.updateTask(newTask);
    }
    return updatedTask;
  }
}

export default OrganizedTaskClass;
