import { Module } from "../modals/module";
import ModuleTask from "../modals/module-task";
import TaskClass from "./TaskClass";

const taskObj = new TaskClass();

class ModuleClass {
  async createModule(module, project) {
    try {
      const moduleObj = new Module({
        name: module.name,
        project,
      });
      return await moduleObj.save();
    } catch (error) {
      // console.log(error);
    }
    return true;
  }

  async addTask(task, user) {
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
