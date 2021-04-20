import { pick } from "lodash";

import CapturedTaskClass from "./CapturedClass";
import Folder from "../interface/folder";
import ModuleClass from "./ModuleClass";
import Project from "../interface/project";
import ProjectClass from "./ProjectClass";
import Task from "../interface/task";
import TaskClass from "./TaskClass";
import User from "../interface/user";

const capturedObj = new CapturedTaskClass();

class OrganizedTaskClass {
  task: TaskClass;

  project: ProjectClass;

  module: ModuleClass;

  constructor() {
    this.task = new TaskClass();
    this.project = new ProjectClass();
    this.module = new ModuleClass();
  }

  private async addTaskInOrganizedModal(task: Task): Promise<Task> {
    return this.task.addTaskInOrganizedModal(task);
  }

  private async addToProject(project: Project, user: User): Promise<Project> {
    const projectObj = await this.project.addProject(project, user);
    const { modules, tasks } = project;
    if (modules.length > 0) {
      for (let i = 0; i < modules.length; i += 1) {
        const moduleObj = await this.module.addModule(modules[i], projectObj);

        const moduleTasks = await this.task.createTask(modules[i].tasks, user);

        for (let j = 0; j < moduleTasks.length; j += 1) {
          const organizedTaskObj = await this.addTaskInOrganizedModal(
            moduleTasks[j]
          );
          await this.module.addTaskToModule(moduleObj, organizedTaskObj);
        }
      }
    }

    if (tasks.length > 0) {
      const projectTasks = await this.task.createTask(project.tasks, user);

      for (let i = 0; i < projectTasks.length; i += 1) {
        const organizedTaskObj = await this.addTaskInOrganizedModal(
          projectTasks[i]
        );
        await this.project.addTaskToProject(projectObj, organizedTaskObj);
      }
    }

    return pick(projectObj, "_id", "name");
  }

  private async addToLater(task: Task, user: User) {
    return this.task.addTaskInLaterModal(task, user);
  }

  private async addToWaiting(task: Task, user: User) {
    return this.task.addTaskInWaiting(task, user);
  }

  private async cleanUp(task: Task) {
    if (task.from === "captured") {
      await capturedObj.deleteTask(task._id);
    }
    if (task.to === "project") {
      await this.task.deleteTask(task._id);
    }
  }

  async getFolders(user: User): Promise<Array<Folder>> {
    const simpletasks = await this.task.getOrganizedTasks(user);
    const projects = await this.project.getAllProjects(user);
    const waitingTasks = await this.task.getAwaitingTasks(user);
    const laterTasks = await this.task.getLaterTasks(user);
    const folders = [];
    folders.push({
      title: "Simple tasks",
      subtitle: `${simpletasks.length} tasks`,
      total: simpletasks.length,
    });
    folders.push({
      title: "Projects",
      subtitle: `${projects.length} projects`,
      total: projects.length,
    });
    folders.push({
      title: "Waiting",
      subtitle: `${waitingTasks.length} awaiting`,
      total: waitingTasks.length,
    });
    folders.push({
      title: "Later",
      subtitle: `${laterTasks.length} tasks`,
      total: laterTasks.length,
    });
    return folders;
  }

  async organizeTask(task: Task, user: User): Promise<Task | Project> {
    let addedTask;
    if (task.to === "simple-task") {
      addedTask = await this.addTaskInOrganizedModal(task);
    }
    if (task.to === "project") {
      addedTask = await this.addToProject(task.project, user);
    }
    if (task.to === "later") {
      addedTask = await this.addToLater(task, user);
    }
    if (task.to === "waiting") {
      addedTask = await this.addToWaiting(task, user);
    }

    await this.cleanUp(task);
    return addedTask;
  }
}

export default OrganizedTaskClass;
