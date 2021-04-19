import CapturedTaskClass from "./CapturedClass";
import Project from "../interface/project";
import ProjectClass from "./ProjectClass";
import Task from "../interface/task";
import TaskClass from "./TaskClass";
import User from "../interface/user";

const capturedObj = new CapturedTaskClass();

class OrganizedTaskClass {
  task: TaskClass;

  project: ProjectClass;

  constructor() {
    this.task = new TaskClass();
    this.project = new ProjectClass();
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

  private async addTaskInOrganizedModal(task: Task): Promise<Task> {
    return this.task.addTaskInOrganizedModal(task);
  }

  private async addToProject(project: Project, user: User): Promise<Project> {
    const projectObj = await this.project.addProject(project, user);
    const tasks = await this.task.createTask(project.tasks, user);

    for (let i = 0; i < tasks.length; i += 1) {
      const organizedTaskObj = await this.addTaskInOrganizedModal(tasks[i]);
      await this.project.addTaskToProject(projectObj, organizedTaskObj);
    }

    return projectObj;
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
}

export default OrganizedTaskClass;
