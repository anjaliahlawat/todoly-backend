import { pick } from "lodash";

import { Project as ProjectModal } from "../modals/project";
import User from "../interface/user";
import Project from "../interface/project";
import Task from "../interface/task";
import ProjectTask from "../modals/project-task";
import Module from "../interface/module";
import { Module as ModuleModal } from "../modals/module";

class ProjectClass {
  async addProject(project: Project, user: User): Promise<Project> {
    const projectObj = await this.getProject(project.name);
    if (projectObj.length === 0) {
      return this.createProject(project, user);
    }
    return projectObj[0];
  }

  private async getProject(name): Promise<Array<Project>> {
    return ProjectModal.find({ name });
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
