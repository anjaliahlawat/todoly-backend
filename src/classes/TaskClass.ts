import { pick } from "lodash";

import OrganizedTask from "../modals/organizedTask";
import { TaskModal, validateTask } from "../modals/task";
import User from "../interface/user";
import Task from "../interface/task";

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
}

export default TaskClass;
