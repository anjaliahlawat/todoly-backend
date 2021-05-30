import { pick } from "lodash";

import { TaskModel, validateTask, Task } from "../models/task";
import { User } from "../models/users";

class TaskClass {
  async createTask(tasks: Array<Task>, user: User): Promise<Array<Task>> {
    const savedTasks = [];

    for (let i = 0; i < tasks.length; i += 1) {
      if (tasks[i].type === "text") {
        const { error } = validateTask(pick(tasks[i], ["desc", "type"]));
        if (error) throw error;

        let newTask = new TaskModel({
          desc: tasks[i].desc,
          type: tasks[i].type,
          user,
        });
        newTask = await newTask.save();
        savedTasks.push({ ...newTask, ...tasks[i] });
      }
    }
    return savedTasks;
  }

  async deleteAll(tasks: Array<Task>): Promise<void> {
    for (let i = 0; i < tasks.length; i += 1) {
      await this.delete(tasks[i]._id);
    }
  }

  async delete(taskId: string): Promise<void> {
    await TaskModel.findByIdAndRemove(taskId);
  }

  async getAllTasks(user: User): Promise<Array<Task>> {
    const tasksStoredInDB = await TaskModel.find({ user: user._id });
    return tasksStoredInDB;
  }

  async getTaskDetails(_id: string): Promise<Task> {
    return TaskModel.findById(_id);
  }

  async updateTask(task: Task): Promise<Task> {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      { _id: task._id },
      { desc: task.desc }
    );
    return updatedTask;
  }
}

export default TaskClass;
