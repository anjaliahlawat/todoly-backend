const _ = require("lodash");

const { CapturedTask, validate } = require("../modals/captured");

class CapturedTaskClass {
  async createTask(user, tasks) {
    try {
      const savedTasks = [];
      for (let i = 0; i < tasks.length; i++) {
        const { error } = validate(tasks[i]);
        if (error) return res.status(400).send(error.details[0].message);

        let captured = new CapturedTask({
          desc: tasks[i].desc,
          user,
        });
        captured = await captured.save();
        savedTasks.push(captured);
      }
      return savedTasks;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllTasks(user) {
    try {
      const tasks = await CapturedTask.find({ user });
      for (let i = 0; i < tasks.length; i++) {
        tasks[i] = _.pick(tasks[i], ["_id", "desc", "category", "date"]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTask(task_id) {
    const task = await CapturedTask.findByIdAndRemove(task_id);
    return task;
  }
}

module.exports = CapturedTaskClass;
