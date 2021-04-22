import { pick } from "lodash";

import Module from "../interface/module";
import ModuleClass from "./ModuleClass";
import { Module as ModuleModal } from "../modals/module";
import Project from "../interface/project";
import ProjectTask from "../modals/project-task";
import { Project as ProjectModal } from "../modals/project";
import Task from "../interface/task";
import User from "../interface/user";

class ProjectClass {
  module: ModuleClass;

  constructor() {
    this.module = new ModuleClass();
  }

  async addProject(project: Project, user: User): Promise<Project> {
    const projectObj = await this.getProject(project.name);
    if (projectObj.length === 0) {
      return this.createProject(project, user);
    }
    return projectObj[0];
  }

  private async getProject(prop: string): Promise<Array<Project>> {
    return ProjectModal.or([{ name: prop }, { _id: prop }]);
  }

  async getAllProjects(user: User): Promise<Array<Project>> {
    const projects = await ProjectModal.find({ user });
    return projects;
  }

  async getProjectCount(user: User): Promise<number> {
    const count = await ProjectModal.where({ user }).count();
    return count;
  }

  async getProjects(user: User): Promise<Array<Project>> {
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
    const modules = await ModuleModal.find({ project });
    return modules;
  }

  async getProjectFolders(
    user: User,
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
      const moduleTasks = await (
        await this.module.getModuleTasks(modules[i]._id)
      ).length;
      projectDetails.push({
        name: modules[i].name,
        subtitle: `${moduleTasks} tasks`,
        total: moduleTasks,
      });
    }
    return projectDetails;
  }

  async getProjectTasks(project: string): Promise<Array<Task>> {
    const tasks = await ProjectTask.find({ project });
    return tasks;
  }

  private async createProject(project: Project, user: User): Promise<Project> {
    const projectObj = new ProjectModal({
      name: project.name,
      user,
    });
    return projectObj.save();
  }

  async addTaskToProject(project: Project, task: Task): Promise<void> {
    const projectTask = await new ProjectTask({ task, project });
    projectTask.save();
  }
}

export default ProjectClass;
