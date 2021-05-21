import { pick } from "lodash";

import { Module as ModuleModal } from "../modals/module";
import Module from "../interface/module";
import ModuleTask from "../modals/module-task";
import Project from "../interface/project";
import Task from "../interface/task";
import TaskClass from "./TaskClass";

class ModuleClass {
  task: TaskClass;

  constructor() {
    this.task = new TaskClass();
  }

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

  async deleteModules(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      await ModuleModal.findByIdAndRemove(ids[i]);
      await this.deleteModuleTask(ids[i]);
    }
  }

  async deleteModuleTask(id: string): Promise<void> {
    const moduleTask = await ModuleTask.findOneAndRemove({ module: id });
    await this.task.delete(moduleTask.task);
    await this.task.findByTaskIdAndDeleteOrganizedTask(moduleTask.task);
  }

  async findByProjectIdAndDelete(projectId: string): Promise<void> {
    const modules = await ModuleModal.find({ project: projectId });
    const tempArr: Array<string> = [];
    for (let i = 0; i < modules.length; i += 1) {
      tempArr.push(modules[i]._id);
    }
    await this.deleteModules(tempArr);
  }

  async getModuleTasks(module: string): Promise<Array<Module>> {
    const moduletasks = await ModuleTask.find({ module });
    return moduletasks;
  }
}

export default ModuleClass;
