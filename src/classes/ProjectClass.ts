import Module from "../interface/module";
import ModuleClass from "./ModuleClass";
import { Module as ModuleModal } from "../modals/module";
import Project from "../interface/project";
import ProjectTask from "../modals/project-task";
import { Project as ProjectModal } from "../modals/project";
import Task from "../interface/task";
import TaskClass from "./TaskClass";
import User from "../interface/user";

class ProjectClass {
  module: ModuleClass;

  task: TaskClass;

  constructor() {
    this.module = new ModuleClass();
    this.task = new TaskClass();
  }

  async addProject(project: Project, user: User): Promise<Project> {
    const projectObj = await this.getProject(project.name);
    if (projectObj.length === 0) {
      return this.createProject(project, user);
    }
    return projectObj[0];
  }

  async addTaskToProject(project: Project, task: Task): Promise<void> {
    const projectTask = await new ProjectTask({ task, project });
    projectTask.save();
  }

  private async createProject(project: Project, user: User): Promise<Project> {
    const projectObj = new ProjectModal({
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
      // await this.deleteProjectTasks(ids);
    }
  }

  async deleteProject(id: string): Promise<void> {
    await ProjectModal.findByIdAndRemove(id);
  }

  async deleteProjectTasks(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      const projectTask = await ProjectTask.findByIdAndRemove(ids[i]);
      await this.task.delete(projectTask.task);
      await this.task.findByTaskIdAndDeleteOrganizedTask(projectTask.task);
    }
  }

  async findByProjectIdAndDeleteProjectTasks(projectId: string): Promise<void> {
    const projectTasks = await ProjectTask.find({ project: projectId });
    for (let i = 0; i < projectTasks.length; i += 1) {
      await ProjectTask.findByIdAndRemove(projectTasks[i]._id);
      await this.task.delete(projectTasks[i].task);
      await this.task.findByTaskIdAndDeleteOrganizedTask(projectTasks[i].task);
    }
  }

  private async getProject(prop: string): Promise<Array<Project>> {
    return ProjectModal.find().or([{ name: prop }, { _id: prop }]);
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

  async updateProject(data: Project & Module): Promise<Project | Module> {
    let updatedData: Project | Module;
    if (data.type === "project") {
      updatedData = await ProjectModal.findByIdAndUpdate(
        { _id: data._id },
        {
          name: data.name,
        }
      );
    } else if (data.type === "module") {
      updatedData = await ModuleModal.findByIdAndUpdate(
        { _id: data._id },
        {
          name: data.name,
        }
      );
    }
    return updatedData;
  }
}

export default ProjectClass;
