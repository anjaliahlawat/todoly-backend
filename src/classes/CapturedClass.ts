import { pick } from "lodash";
import CapturedTask from "../modals/captured";
import Task from "../interface/task";

class CapturedTaskClass {
  async add(tasks: Array<Task>): Promise<Array<Task>> {
    const savedTasks = [];
    for (let i = 0; i < tasks.length; i += 1) {
      let capturedTask = new CapturedTask({
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
      const task = await CapturedTask.find({ task: tasks[i]._id });
      capturedTasks.push({
        ...pick(task, ["date"]),
        ...pick(tasks[i], ["_id", "desc", "type"]),
      });
    }

    return capturedTasks;
  }

  async deleteTask(taskId: string): Promise<void> {
    await CapturedTask.findOneAndRemove({ task: taskId });
  }
}

export default CapturedTaskClass;
