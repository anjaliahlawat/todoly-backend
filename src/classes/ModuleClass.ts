import { Module, moduleSchema } from "../modals/module";
import ModuleTask from "../modals/module-task";
import { projectSchema } from "../modals/project";
import { taskSchema } from "../modals/task";
import TaskClass from "./TaskClass";

const taskObj = new TaskClass();

class ModuleClass {
  async createModule(
    module: typeof moduleSchema,
    project: typeof projectSchema
  ): Promise<typeof moduleSchema> {
    try {
      const moduleObj = new Module({
        name: module.name,
        project,
      });
      return await moduleObj.save();
    } catch (error) {
      // console.log(error);
      return 0;
    }
  }

  async addTask(
    task: typeof taskSchema,
    user: typeof taskSchema
  ): Promise<typeof taskSchema> {
    const savedTask = await taskObj.createTask(task, true, user);

    const moduleTaskObj = new ModuleTask({
      module: task.module_id,
      task: savedTask._id,
    });

    await moduleTaskObj.save();
    return savedTask;
  }
}

export default ModuleClass;
