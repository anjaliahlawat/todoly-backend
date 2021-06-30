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

  async addTaskToModule(module: Module, task: OrganizedTask): Promise<void> {
    const moduleTask = new ModuleTaskModel({ task, module });
    await moduleTask.save();
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

  private async getModule(name): Promise<Array<Module>> {
    return ModuleModel.find({ name });
  }

  async deleteModules(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      await ModuleModel.findByIdAndRemove(ids[i]);
      await this.deleteModuleTask(ids[i]);
    }
  }

  async deleteModuleTask(id: string): Promise<void> {
    const moduleTask = await ModuleTaskModel.findOneAndRemove({ module: id });
    await this.organizedTask.deleteTasks([moduleTask.task.toString()]);
  }

  async deleteModuleTasks(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      const moduleTask = await ModuleTaskModel.findByIdAndRemove(ids[i]);
      await this.organizedTask.deleteTasks([moduleTask.task.toString()]);
    }
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

  async updateModuleTask(data: {
    _id: string;
    desc?: string;
    finishDate?: Date;
  }): Promise<ModuleTask> {
    const updatedData = await ModuleTaskModel.findById(data._id);
    await this.organizedTask.updateTask({
      ...data,
      _id: updatedData.task.toString(),
    });
    return updatedData;
  }
}

export default ModuleClass;
