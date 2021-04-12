import { pick } from "lodash";
import { CapturedTask, validateTask } from "../modals/captured";
import Task from "../interface/task";
import User from "../interface/user";

class CapturedTaskClass {
  async createTask(user: User, tasks: Array<Task>): Promise<Array<Task>> {
    const savedTasks = [];
    for (let i = 0; i < tasks.length; i += 1) {
      const { error } = validateTask(tasks[i]);
      if (error) throw error.details[0].message;

      let captured = new CapturedTask({
        desc: tasks[i].desc,
        user,
      });
      captured = await captured.save();
      savedTasks.push(captured);
    }

    return savedTasks;
  }

  async getAllTasks(user: User): Promise<Array<Task>> {
    const tasksStoredInDB = await CapturedTask.find({ user });
    const tasks = [];
    for (let i = 0; i < tasksStoredInDB.length; i += 1) {
      tasks.push(pick(tasksStoredInDB[i], ["_id", "desc", "category", "date"]));
    }
    return tasks;
  }

  async deleteTask(taskId: string): Promise<Task> {
    const task = await CapturedTask.findByIdAndRemove(taskId);
    return task;
  }
}

export default CapturedTaskClass;
