import { Task, taskSchema } from "../modals/task";
import { userSchema } from "../modals/users";

class TaskClass {
  async createTask(
    task: typeof taskSchema,
    project = false,
    user: typeof userSchema
  ): Promise<typeof taskSchema> {
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
      return 0;
    }
  }
}

export default TaskClass;
