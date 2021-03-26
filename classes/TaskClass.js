class TaskClass {
  async createTask(task, project = false, user) {
    try {
      const task = new Task({
        desc: task.desc,
        category,
        isProject: project,
        finish_date: task.finish_date,
        user,
      });
      return await task.save();
    } catch (error) {
      console.log(error);
    }
  }

  async editTask() {}

  async deleteTask() {}
}

module.exports = TaskClass;
