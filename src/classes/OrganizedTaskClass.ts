import { pick } from "lodash";

import CapturedTaskClass from "./CapturedClass";
import Folder from "../interface/folder";
import ModuleClass from "./ModuleClass";
import LaterClass from "./LaterClass";
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

  later: LaterClass;

  constructor() {
    this.task = new TaskClass();
    this.project = new ProjectClass();
    this.module = new ModuleClass();
    this.later = new LaterClass();
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
    return this.later.addTaskInLaterModal(task, user);
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
    const simpletasksCount = await this.task.getOrganizedTasksCount(user);
    const projectCount = await this.project.getProjectCount(user);
    const waitingTaskCount = await this.task.getAwaitingTaskCount(user);
    const laterTaskCount = await this.later.getLaterTaskCount(user);
    const folders = [];
    folders.push({
      title: "Simple tasks",
      subtitle: `${simpletasksCount} tasks`,
      total: simpletasksCount,
    });
    folders.push({
      title: "Projects",
      subtitle: `${projectCount} projects`,
      total: projectCount,
    });
    folders.push({
      title: "Waiting",
      subtitle: `${waitingTaskCount} awaiting`,
      total: waitingTaskCount,
    });
    folders.push({
      title: "Later",
      subtitle: `${laterTaskCount} tasks`,
      total: laterTaskCount,
    });
    return folders;
  }

  async getFolderData(
    user: User,
    folder: string
  ): Promise<Array<Task> | Array<Project>> {
    let count;
    if (folder === "simple-tasks") {
      count = await this.task.getOrganizedTasksCount(user);
    }
    return count;
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
