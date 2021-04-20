import { pick } from "lodash";

import LaterTasks from "../modals/later";
import OrganizedTask from "../modals/organizedTask";
import { TaskModal, validateTask } from "../modals/task";
import Task from "../interface/task";
import User from "../interface/user";
import { WaitingList, validateWaitingList } from "../modals/waitingList";

class TaskClass {
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

  async getAllTasks(user: User): Promise<Array<Task>> {
    const tasksStoredInDB = await TaskModal.find({ user });
    return tasksStoredInDB;
  }

  async getOrganizedTasks(user: User): Promise<Array<Task>> {
    const tasks = await this.getAllTasks(user);
    const organizedTasks = await OrganizedTask.find({
      path: /^simple-tasks/,
      task: { $in: [...tasks] },
    });
    return organizedTasks;
  }

  async getLaterTasks(user: User): Promise<Array<Task>> {
    const laterTasks = await LaterTasks.find({ user });
    return laterTasks;
  }

  async getAwaitingTasks(user: User): Promise<Array<Task>> {
    const waitingtasks = await WaitingList.find({ user });
    return waitingtasks;
  }

  async deleteTask(taskId: string): Promise<void> {
    await TaskModal.findByIdAndRemove(taskId);
  }

  async updateTask(task: Task): Promise<Task> {
    const updatedTask = await TaskModal.findByIdAndUpdate(
      { _id: task._id },
      task
    );
    return updatedTask;
  }

  async addTaskInOrganizedModal(task: Task): Promise<Task> {
    const taskObj = new OrganizedTask({
      task,
      path: task.path,
      finish_date: task.finishDate,
    });
    return taskObj.save();
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

  async addTaskInWaiting(task: Task, user: User): Promise<Task> {
    let waitingObj;

    const { error } = validateWaitingList(pick(task, ["reason"]));
    if (error) throw error.details[0].message;

    if (task.from === "captured") {
      waitingObj = await new WaitingList({
        task: task._id,
        reason: task.reason,
        date: task.finishDate,
        user,
      });
    }
    if (task.from === "organized") {
      waitingObj = await new WaitingList({
        organizedTask: task._id,
        reason: task.reason,
        date: task.finishDate,
        user,
      });
    }
    waitingObj = await waitingObj.save();
    return pick(waitingObj, "_id", "reason", "date");
  }
}

export default TaskClass;
