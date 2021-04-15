import ModuleClass from "./ModuleClass";
import TaskClass from "./TaskClass";
import { Project as ProjectModal } from "../modals/project";
import ProjectTask from "../modals/project-task";
import Task from "../interface/task";
import User from "../interface/user";
import Project from "../interface/project";

const moduleObj = new ModuleClass();
const taskObj = new TaskClass();

class ProjectClass {
  async createProject(project: Project, userId: string): Promise<Project> {
    let projectObj = new ProjectModal({
      desc: project.desc,
      user: userId,
    });

    projectObj = await projectObj.save();
    return projectObj;
  }

  async addTask(task: Task): Promise<Task> {
    let savedTask: Task;
    // if (task.moduleId) {
    //   savedTask = await moduleObj.addTask(task);
    // } else {
    //   savedTask = await taskObj.organizeTask(task, true);
    //   const projectTask = new ProjectTask({
    //     project: task.projectId,
    //     task: savedTask,
    //   });

    //   await projectTask.save();
    // }

    return savedTask;
  }
}

export default ProjectClass;
