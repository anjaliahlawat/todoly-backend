import { Task as TaskModal } from "../modals/task";
import User from "../interface/user";
import Task from "../interface/task";

class TaskClass {
  async createTask(task: Task, project = false, user: User): Promise<Task> {
    const taskObj = new TaskModal({
      desc: task.desc,
      isProject: project,
      finish_date: task.finishDate,
      user,
    });
    return taskObj.save();
  }
}

export default TaskClass;
