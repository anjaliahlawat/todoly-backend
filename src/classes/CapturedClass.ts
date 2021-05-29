import { pick } from "lodash";
import { CapturedTaskModel } from "../models/captured";
import { Task } from "../models/task";

class CapturedTaskClass {
  async add(tasks: Array<Task>): Promise<Array<Task>> {
    const savedTasks = [];
    for (let i = 0; i < tasks.length; i += 1) {
      let capturedTask = new CapturedTaskModel({
        task: tasks[i],
      });

      capturedTask = await capturedTask.save();

      savedTasks.push({
        ...pick(tasks[i], ["_id", "desc", "type"]),
        ...pick(capturedTask, ["date"]),
      });
    }
    return savedTasks;
  }

  async getAllTasks(tasks: Array<Task>): Promise<Array<Task>> {
    const capturedTasks = [];
    for (let i = 0; i < tasks.length; i += 1) {
      const task = await CapturedTaskModel.find({ task: tasks[i]._id });
      capturedTasks.push({
        ...pick(task, ["date"]),
        ...pick(tasks[i], ["_id", "desc", "type"]),
      });
    }

    return capturedTasks;
  }

  async deleteAll(tasks: Array<Task>): Promise<void> {
    for (let i = 0; i < tasks.length; i += 1) {
      await this.delete(tasks[i]._id);
    }
  }

  async delete(taskId: string): Promise<void> {
    await CapturedTaskModel.findOneAndRemove({ task: taskId });
  }
}

export default CapturedTaskClass;
