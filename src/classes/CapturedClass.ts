import { pick } from "lodash";
import { CapturedTask, validateTask } from "../modals/captured";
import { taskSchema } from "../modals/task";
import { userSchema } from "../modals/users";

class CapturedTaskClass {
  async createTask(
    user: typeof userSchema,
    tasks: typeof taskSchema
  ): Promise<typeof taskSchema> {
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
      return 0;
    }
  }

  async getAllTasks(user: typeof userSchema): Promise<typeof taskSchema> {
    try {
      const tasksStoredInDB = await CapturedTask.find({ user });
      const tasks = [];
      for (let i = 0; i < tasksStoredInDB.length; i += 1) {
        tasks.push(
          pick(tasksStoredInDB[i], ["_id", "desc", "category", "date"])
        );
      }
      return tasks;
    } catch (error) {
      // console.log(error);
      return 0;
    }
  }

  async deleteTask(taskId: string): Promise<typeof taskSchema> {
    const task = await CapturedTask.findByIdAndRemove(taskId);
    return task;
  }
}

export default CapturedTaskClass;
