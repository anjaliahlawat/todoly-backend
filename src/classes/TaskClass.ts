import { pick } from "lodash";

import OrganizedTask from "../modals/organizedTask";
import { TaskModal, validateTask } from "../modals/task";
import Task from "../interface/task";
import User from "../interface/user";

class TaskClass {
  async addTaskInOrganizedModal(task: Task): Promise<Task> {
    const taskObj = new OrganizedTask({
      task,
      path: task.path,
      finish_date: task.finishDate,
    });
    return taskObj.save();
  }

  async createTask(tasks: Array<Task>, user: User): Promise<Array<Task>> {
    const savedTasks = [];

    for (let i = 0; i < tasks.length; i += 1) {
      if (tasks[i].type === "text") {
        const { error } = validateTask(pick(tasks[i], ["desc", "type"]));
        if (error) throw error.details[0].message;

        let newTask = new TaskModal({
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

  async deleteTask(taskId: string): Promise<void> {
    await TaskModal.findByIdAndRemove(taskId);
  }

  async getAllTasks(user: User): Promise<Array<Task>> {
    const tasksStoredInDB = await TaskModal.find({ user });
    return tasksStoredInDB;
  }

  async getTaskDetails(_id: string): Promise<Task> {
    return TaskModal.findById(_id);
  }

  async getOrganizedTasksCount(user: User): Promise<number> {
    const tasks = await this.getAllTasks(user);
    const count = await OrganizedTask.where({
      path: /^simple-tasks/,
      task: { $in: [...tasks] },
    }).count();
    return count;
  }

  async getOrganizedTasks(user: User): Promise<Array<Task>> {
    const tasks = await this.getAllTasks(user);
    const organizedTasks = await this.getOrganizedTaskFromDB(tasks);

    const finalTasks = [];

    for (let i = 0; i < organizedTasks.length; i += 1) {
      finalTasks.push({
        ...pick(await this.getTaskDetails(organizedTasks[i].task), [
          "desc",
          "type",
        ]),
        ...pick(organizedTasks[i], ["_id", "path", "finish_date", "status"]),
      });
    }
    return finalTasks;
  }

  private async getOrganizedTaskFromDB(
    tasks: Array<Task>
  ): Promise<Array<Task>> {
    const organizedTasks = await OrganizedTask.find({
      path: /^simple-tasks/,
      task: { $in: [...tasks] },
    });
    return organizedTasks;
  }

  async updateTask(task: Task): Promise<Task> {
    let updatedTask: Task;
    if (task.finishDate) {
      updatedTask = await OrganizedTask.findByIdAndUpdate(
        { _id: task._id },
        {
          finish_date: task.finishDate,
        }
      );
    } else {
      const organizedTask = await OrganizedTask.findById(task._id);
      updatedTask = await TaskModal.findByIdAndUpdate(
        { _id: organizedTask.task },
        { desc: task.desc }
      );
    }
    return updatedTask;
  }
}

export default TaskClass;
