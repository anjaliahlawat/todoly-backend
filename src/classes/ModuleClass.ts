import { Module as ModuleModal } from "../modals/module";
import Task from "../interface/task";
import Module from "../interface/module";
import Project from "../interface/project";
import ModuleTask from "../modals/module-task";

class ModuleClass {
  async addModule(module: Module, project: Project): Promise<Module> {
    const moduleObj = await this.getModule(module.name);
    if (moduleObj.length === 0) {
      return this.createModule(module, project);
    }
    return moduleObj[0];
  }

  private async getModule(name): Promise<Array<Module>> {
    return ModuleModal.find({ name });
  }

  private async createModule(
    module: Module,
    project: Project
  ): Promise<Module> {
    const moduleObj = new ModuleModal({
      name: module.name,
      project,
    });
    return moduleObj.save();
  }

  async addTaskToModule(module: Module, task: Task): Promise<void> {
    const moduleTask = await new ModuleTask({ task, module });
    moduleTask.save();
  }

  async getModuleTasks(module: string): Promise<Array<Module>> {
    const moduletasks = await ModuleTask.find({ module });
    return moduletasks;
  }
}

export default ModuleClass;
