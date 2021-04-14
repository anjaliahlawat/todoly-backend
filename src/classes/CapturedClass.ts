import { pick } from "lodash";
import { CapturedTask, validateTask } from "../modals/captured";
import Task from "../interface/task";
import User from "../interface/user";

class CapturedTaskClass {
  async createTask(user: User, tasks: Array<Task>): Promise<Array<Task>> {
    const savedTasks = [];
    for (let i = 0; i < tasks.length; i += 1) {
      if (tasks[i].type === "text") {
        const { error } = validateTask(tasks[i]);
        if (error) throw error.details[0].message;

        let captured = new CapturedTask({
          desc: tasks[i].desc,
          type: tasks[i].type,
          user,
        });
        captured = await captured.save();
        savedTasks.push(pick(captured, ["_id", "desc", "date", "type"]));
      }
    }
    return savedTasks;
  }

  async updateTask(task: Task): Promise<Task> {
    const updatedTask = await CapturedTask.findByIdAndUpdate(
      { _id: task._id },
      task
    );
    return updatedTask;
  }

  async getAllTasks(user: User): Promise<Array<Task>> {
    const tasksStoredInDB = await CapturedTask.find({ user });
    const tasks = [];
    for (let i = 0; i < tasksStoredInDB.length; i += 1) {
      tasks.push(pick(tasksStoredInDB[i], ["_id", "desc", "type", "date"]));
    }
    return tasks;
  }

  async deleteTask(taskId: string): Promise<Task> {
    const task = await CapturedTask.findByIdAndRemove(taskId);
    return task;
  }
}

export default CapturedTaskClass;
