import * as _ from "lodash";
import { CapturedTask, validateTask } from "../modals/captured";

class CapturedTaskClass {
  async createTask(user, tasks) {
    try {
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
    } catch (error) {
      // console.log(error);
    }
    return true;
  }

  async getAllTasks(user) {
    try {
      const tasks = await CapturedTask.find({ user });
      for (let i = 0; i < tasks.length; i += 1) {
        tasks[i] = _.pick(tasks[i], ["_id", "desc", "category", "date"]);
      }
    } catch (error) {
      // console.log(error);
    }
    return true;
  }

  async deleteTask(taskId) {
    const task = await CapturedTask.findByIdAndRemove(taskId);
    return task;
  }
}

module.exports = CapturedTaskClass;
