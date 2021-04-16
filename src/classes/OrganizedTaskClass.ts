import Project from "../interface/project";
import Task from "../interface/task";
import User from "../interface/user";
import ProjectClass from "./ProjectClass";
import TaskClass from "./TaskClass";

class OrganizedTaskClass {
  task: TaskClass;

  project: ProjectClass;

  constructor() {
    this.task = new TaskClass();
    this.project = new ProjectClass();
  }

  async organizeTask(task: Task, user: User): Promise<Task | Project> {
    let addedTask;
    if (task.loc === "simple-task") {
      addedTask = this.addTaskInOrganizedModal(task);
    }
    if (task.loc === "project") {
      addedTask = this.addToProject(task.project, user);
    }
    return addedTask;
  }

  private async addTaskInOrganizedModal(task: Task): Promise<Task> {
    return this.task.addTaskInOrganizedModal(task);
  }

  private async addToProject(project: Project, user: User): Promise<Project> {
    const projectObj = await this.project.addProject(project, user);
    const tasks = await this.task.createTask(project.tasks, user);
    console.log(tasks);

    for (let i = 0; i < tasks.length; i += 1) {
      const organizedTaskObj = await this.addTaskInOrganizedModal(tasks[i]);
      await this.project.addTaskToProject(projectObj, organizedTaskObj);
    }

    return projectObj;
  }

  // private async addToLater() {

  // }
  // private async addToWaiting() {

  // }
}

export default OrganizedTaskClass;
