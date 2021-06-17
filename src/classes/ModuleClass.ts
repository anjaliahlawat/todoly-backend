import { ModuleModel, Module } from "../models/module";
import { ModuleTaskModel, ModuleTask } from "../models/module-task";
import { OrganizedTask } from "../models/organizedTask";
import { Project } from "../models/project";
import OrganizedTaskClass from "./OrganizedTaskClass";
import TaskClass from "./TaskClass";

class ModuleClass {
  organizedTask: OrganizedTaskClass;

  task: TaskClass;

  constructor() {
    this.organizedTask = new OrganizedTaskClass();
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
    return ModuleModel.find({ name });
  }

  private async createModule(
    module: Module,
    project: Project
  ): Promise<Module> {
    const moduleObj = new ModuleModel({
      name: module.name,
      project,
    });
    return moduleObj.save();
  }

  async addTaskToModule(module: Module, task: OrganizedTask): Promise<void> {
    const moduleTask = new ModuleTaskModel({ task, module });
    await moduleTask.save();
  }

  async deleteModules(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      await ModuleModel.findByIdAndRemove(ids[i]);
      await this.deleteModuleTask(ids[i]);
    }
  }

  async deleteModuleTask(id: string): Promise<void> {
    const moduleTask = await ModuleTaskModel.findOneAndRemove({ module: id });
    await this.task.delete(moduleTask.task.toString());
    await this.organizedTask.findByTaskIdAndDeleteTask(
      moduleTask.task.toString()
    );
  }

  async findByProjectIdAndDelete(projectId: string): Promise<void> {
    const modules = await ModuleModel.find({ project: projectId });
    const tempArr: Array<string> = [];
    for (let i = 0; i < modules.length; i += 1) {
      tempArr.push(modules[i]._id);
    }
    await this.deleteModules(tempArr);
  }

  async getModuleTasks(module: string): Promise<Array<ModuleTask>> {
    const moduletasks = await ModuleTaskModel.find({ module });
    return moduletasks;
  }
}

export default ModuleClass;
