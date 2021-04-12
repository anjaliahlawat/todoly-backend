import { Module as ModuleModal } from "../modals/module";
// import ModuleTask from "../modals/module-task";
import Task from "../interface/task";
import Module from "../interface/module";
import Project from "../interface/project";
import User from "../interface/user";
import TaskClass from "./TaskClass";

const taskObj = new TaskClass();

class ModuleClass {
  async createModule(module: Module, project: Project): Promise<Module> {
    const moduleObj = new ModuleModal({
      name: module.name,
      project,
    });
    return moduleObj.save();
  }

  async addTask(task: Task, user: User): Promise<Task> {
    const savedTask = await taskObj.createTask(task, true, user);

    // const moduleTaskObj = new ModuleTask({
    //   module: task.module_id,
    //   task: savedTask._id,
    // });

    // await moduleTaskObj.save();
    return savedTask;
  }
}

export default ModuleClass;
