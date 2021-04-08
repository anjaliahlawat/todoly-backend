import ModuleClass from "./ModuleClass";
import TaskClass from "./TaskClass";
import { Project } from "../modals/project";

import ProjectTask from "../modals/project-task";

const moduleObj = new ModuleClass();
const taskObj = new TaskClass();

class ProjectClass {
  async createProject(project, userId) {
    try {
      let projectObj = new Project({
        desc: project.desc,
        user: userId,
      });

      projectObj = await projectObj.save();
      return projectObj;
    } catch (error) {
      // console.log(error);
    }
    return true;
  }

  async addTask(task, user) {
    try {
      let savedTask = {};
      if (task.module) {
        savedTask = await moduleObj.addTask(task, user);
      } else {
        savedTask = await taskObj.createTask(task, true, user);
        const projectTask = new ProjectTask({
          project: task.project_id,
          task: savedTask,
        });

        await projectTask.save();
      }

      return savedTask;
    } catch (error) {
      // console.log(error);
    }
    return true;
  }
}

export default ProjectClass;
