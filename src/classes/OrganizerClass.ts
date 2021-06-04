import { pick } from "lodash";
import { Types } from "mongoose";

import AwaitingClass from "./AwaitingClass";
import CapturedTaskClass from "./CapturedClass";
import Folder from "../interface/folder";
import ModuleClass from "./ModuleClass";
import LaterClass from "./LaterClass";
import { Project } from "../models/project";
import ProjectClass from "./ProjectClass";
import { Task } from "../models/task";
import TaskClass from "./TaskClass";
import { User } from "../models/users";
import { Module } from "../models/module";
import OrganizedTaskClass from "./OrganizedTaskClass";
import { OrganizedTask } from "../models/organizedTask";

const capturedObj = new CapturedTaskClass();

type TaskObj = Task & OrganizedTask;

type ModuleRequestObj = Module & { tasks: Array<TaskObj>; path: string };

type ProjectRequestObj = Project & {
  modules: Array<ModuleRequestObj>;
  tasks: Array<TaskObj>;
};

type TaskRequestObj = TaskObj & { project: ProjectRequestObj; reason: string };

class OrganizerClass {
  awaiting: AwaitingClass;

  later: LaterClass;

  module: ModuleClass;

  organizedTask: OrganizedTaskClass;

  project: ProjectClass;

  task: TaskClass;

  constructor() {
    this.awaiting = new AwaitingClass();
    this.later = new LaterClass();
    this.module = new ModuleClass();
    this.organizedTask = new OrganizedTaskClass();
    this.project = new ProjectClass();
    this.task = new TaskClass();
  }

  private async addToProject(
    project: ProjectRequestObj,
    path: string,
    user: User
  ): Promise<Project> {
    const projectObj = await this.project.addProject(project, user);
    const { modules, tasks } = project;
    if (modules.length > 0) {
      for (let i = 0; i < modules.length; i += 1) {
        const moduleObj = await this.module.addModule(modules[i], projectObj);

        const moduleTasks = await this.task.createTask(modules[i].tasks, user);

        for (let j = 0; j < moduleTasks.length; j += 1) {
          const organizedTaskObj = await this.organizedTask.addTask(
            moduleTasks[j],
            modules[i].tasks[j].finishDate,
            modules[i].path
          );
          await this.module.addTaskToModule(moduleObj, organizedTaskObj);
        }
      }
    }

    if (tasks.length > 0) {
      const projectTasks = await this.task.createTask(project.tasks, user);

      for (let i = 0; i < projectTasks.length; i += 1) {
        const organizedTaskObj = await this.organizedTask.addTask(
          projectTasks[i],
          tasks[i].finishDate,
          path
        );
        await this.project.addTaskToProject(projectObj, organizedTaskObj);
      }
    }

    return pick(projectObj, "_id", "name");
  }

  private async cleanUp(task: Task, from: string, to: string) {
    if (from === "captured") {
      await capturedObj.delete(task._id);
    }
    if (to === "project") {
      await this.task.delete(task._id);
    }
  }

  async delete(folderData: {
    ids: Array<string>;
    type: string;
  }): Promise<void> {
    if (
      folderData.type === "project" ||
      folderData.type === "module" ||
      folderData.type === "project-task"
    ) {
      await this.project.delete(folderData.ids, folderData.type);
    } else if (folderData.type === "awaiting") {
      await this.awaiting.delete(folderData.ids);
    } else if (folderData.type === "later") {
      await this.later.delete(folderData.ids);
    } else {
      await this.organizedTask.deleteTasks(folderData.ids);
    }
  }

  async getFolders(user: User): Promise<Array<Folder>> {
    const simpletasksCount = await this.organizedTask.getTasksCount(user);
    const projectCount = await this.project.getProjectCount(user);
    const waitingTaskCount = await this.awaiting.getAwaitingTaskCount(user);
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
    let folderData;
    if (folder === "simple-tasks") {
      folderData = await this.organizedTask.getTasks(user);
    }
    if (folder === "later") {
      folderData = await this.later.getLaterTasks(user);
    }
    if (folder === "awaiting") {
      folderData = await this.awaiting.getAwaitingTasks(user);
    }
    if (folder === "project") {
      folderData = await this.project.getProjects(user);
    }
    return folderData;
  }

  async getFoldersOfFolder(
    user: User,
    folder: string,
    folderId: string
  ): Promise<Array<Task> | Array<Module>> {
    let folderData;
    if (folder === "project") {
      folderData = await this.project.getProjectFolders(user, folderId);
    }
    return folderData;
  }

  async organizeTask(
    task: TaskRequestObj,
    user: User,
    from: string,
    to: string
  ): Promise<Task | Project> {
    let addedTask;

    if (!(await this.validateId(task._id))) {
      const err = {
        code: "404",
        message: "ID invalid",
      };
      throw err;
    }

    if (to.includes("simple-task")) {
      addedTask = await this.organizedTask.addTask(task, task.finishDate, to);
    }
    if (to.includes("project")) {
      addedTask = await this.addToProject(task.project, to, user);
    }
    if (to.includes("later")) {
      addedTask = await this.later.addTaskInLaterModal(task, user, from);
    }
    if (to.includes("waiting")) {
      addedTask = await this.awaiting.addTaskInWaiting(task, from, user);
    }

    await this.cleanUp(task, from, to);
    return addedTask;
  }

  async validateId(_id: string): Promise<boolean> {
    if (Types.ObjectId.isValid(_id)) return true;
    return false;
  }

  async update(folderData: Task & Project): Promise<void> {
    // if (folderData.type === "project" || folderData.type === "module") {
    //   await this.project.updateProject(folderData);
    // } else if (folderData.type === "awaiting") {
    //   await this.awaiting.updateTask(folderData);
    // } else {
    // await this.organizedTask.updateTask(folderData);
    // }
  }
}

export default OrganizerClass;
