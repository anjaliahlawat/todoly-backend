import { Task } from "../modals/task";

class TaskClass {
  async createTask(task, project = false, user) {
    try {
      const taskObj = new Task({
        desc: task.desc,
        isProject: project,
        finish_date: task.finish_date,
        user,
      });
      return await taskObj.save();
    } catch (error) {
      // console.log(error);
    }
    return true;
  }
}

export default TaskClass;
