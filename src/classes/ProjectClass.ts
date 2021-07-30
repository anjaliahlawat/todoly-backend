import { pick } from "lodash";

import ModuleClass from "./ModuleClass";
import { ModuleModel, Module } from "../models/module";
import { ProjectTaskModel, ProjectTask } from "../models/project-task";
import { ProjectModel, Project, validateProject } from "../models/project";
import { Task } from "../models/task";
import TaskClass from "./TaskClass";
import { User } from "../models/users";
import { OrganizedTask } from "../models/organizedTask";
import OrganizedTaskClass from "./OrganizedTaskClass";
import { ModuleTask } from "../models/module-task";

class ProjectClass {
  module: ModuleClass;

  organizedTask: OrganizedTaskClass;

  task: TaskClass;

  constructor() {
    this.module = new ModuleClass();
    this.task = new TaskClass();
    this.organizedTask = new OrganizedTaskClass();
  }

  async addProject(project: Project, user: User): Promise<Project> {
    const { error } = validateProject(pick(project, ["name"]));
    if (error) throw error;

    const projectObj = await this.getProject(project.name, "name");
    if (projectObj.length === 0) {
      return this.createProject(project, user);
    }
    return projectObj[0];
  }

  async addTaskToProject(project: Project, task: OrganizedTask): Promise<void> {
    const projectTask = new ProjectTaskModel({ task, project });
    await projectTask.save();
  }

  private async createProject(project: Project, user: User): Promise<Project> {
    const projectObj = new ProjectModel({
      name: project.name,
      user,
    });
    return projectObj.save();
  }

  async delete(ids: Array<string>, type: string): Promise<void> {
    if (type === "project") {
      for (let i = 0; i < ids.length; i += 1) {
        await this.deleteProject(ids[i]);
        await this.module.findByProjectIdAndDelete(ids[i]);
        await this.findByProjectIdAndDeleteProjectTasks(ids[i]);
      }
    } else if (type === "project-task") {
      await this.deleteProjectTasks(ids);
    } else if (type === "module") {
      await this.module.deleteModules(ids);
    } else if (type === "module-task") {
      await this.module.deleteModuleTasks(ids);
    }
  }

  async deleteProject(id: string): Promise<void> {
    await ProjectModel.findByIdAndRemove(id);
  }

  async deleteProjectTasks(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      const projectTask = await ProjectTaskModel.findByIdAndRemove(ids[i]);
      await this.organizedTask.deleteTasks([projectTask.task.toString()]);
    }
  }

  async findByProjectIdAndDeleteProjectTasks(projectId: string): Promise<void> {
    const projectTasks = await ProjectTaskModel.find({ project: projectId });
    for (let i = 0; i < projectTasks.length; i += 1) {
      await ProjectTaskModel.findByIdAndRemove(projectTasks[i]._id);
      await this.organizedTask.deleteTasks([projectTasks[i].task.toString()]);
    }
  }

  private async getProject(
    value: string,
    prop: string
  ): Promise<Array<Project>> {
    return ProjectModel.find({ [prop]: value });
  }

  async getAllProjects(user: string): Promise<Array<Project>> {
    const projects = await ProjectModel.find({ user });
    return projects;
  }

  async getProjectCount(user: string): Promise<number> {
    const count = await ProjectModel.where({ user }).count();
    return count;
  }

  async getProjects(user: string): Promise<Array<Project>> {
    const projects = await this.getAllProjects(user);
    const projectsDetailArr = [];

    for (let i = 0; i < projects.length; i += 1) {
      projectsDetailArr.push({
        _id: projects[i]._id,
        name: projects[i].name,
        modules: (await this.getProjectModules(projects[i]._id)).length,
        tasks: (await this.getProjectTasks(projects[i]._id)).length,
      });
    }
    return projectsDetailArr;
  }

  async getProjectModules(project: string): Promise<Array<Module>> {
    const modules = await ModuleModel.find({ project });
    return modules;
  }

  async getProjectFolders(
    projectId: string
  ): Promise<Array<Module> | Array<Task>> {
    const projectDetails = [];
    const modules = await this.getProjectModules(projectId);
    const projectTasks = await (await this.getProjectTasks(projectId)).length;
    projectDetails.push({
      title: "All tasks",
      subtitle: `${projectTasks} tasks`,
      total: projectTasks,
    });
    for (let i = 0; i < modules.length; i += 1) {
      const moduleTasks = (await this.module.getModuleTasks(modules[i]._id))
        .length;
      projectDetails.push({
        name: modules[i].name,
        subtitle: `${moduleTasks} tasks`,
        total: moduleTasks,
      });
    }
    return projectDetails;
  }

  async getProjectTasks(project: string): Promise<Array<ProjectTask>> {
    const tasks = await ProjectTaskModel.find({ project });
    return tasks;
  }

  async getProjectTasksWithDetails(
    project: string
  ): Promise<Array<ProjectTask>> {
    const projectTasksDetails = [];
    const projectTasks = await ProjectTaskModel.find({ project });
    for (let i = 0; i < projectTasks.length; i += 1) {
      projectTasksDetails.push(
        await this.organizedTask.getTaskDetails(projectTasks[i].task.toString())
      );
    }
    return projectTasksDetails;
  }

  async moveProject(_id: string, to: string): Promise<void> {
    if (to === "later") {
      await ProjectModel.findByIdAndUpdate(
        { _id },
        {
          isLater: true,
        }
      );
      await this.findByProjectIdAndDeleteProjectTasks(_id);
      await this.module.findByProjectIdAndDelete(_id);
    }
  }

  async updateProject(data: {
    _id: string;
    type: string;
    name?: string;
    desc?: string;
  }): Promise<Project | Module | ProjectTask | ModuleTask> {
    let updatedData: Project | Module | ProjectTask | ModuleTask;
    if (data.type === "project") {
      updatedData = await ProjectModel.findByIdAndUpdate(
        { _id: data._id },
        {
          name: data.name,
        }
      );
    } else if (data.type === "project-task") {
      updatedData = await this.updateProjectTask(data);
    } else if (data.type === "module") {
      updatedData = await ModuleModel.findByIdAndUpdate(
        { _id: data._id },
        {
          name: data.name,
        }
      );
    } else {
      updatedData = await this.module.updateModuleTask(data);
    }
    return updatedData;
  }

  async updateProjectTask(data: {
    _id: string;
    desc?: string;
    finishDate?: Date;
  }): Promise<ProjectTask> {
    const updatedData = await ProjectTaskModel.findById(data._id);
    await this.organizedTask.updateTask({
      ...data,
      _id: updatedData.task.toString(),
    });
    return updatedData;
  }
}

export default ProjectClass;
