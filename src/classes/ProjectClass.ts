import ModuleClass from "./ModuleClass";
import TaskClass from "./TaskClass";
import { Project, projectSchema } from "../modals/project";
import ProjectTask from "../modals/project-task";
import { taskSchema } from "../modals/task";
import { userSchema } from "../modals/users";

const moduleObj = new ModuleClass();
const taskObj = new TaskClass();

class ProjectClass {
  async createProject(
    project: typeof projectSchema,
    userId: string
  ): Promise<typeof projectSchema> {
    try {
      let projectObj = new Project({
        desc: project.desc,
        user: userId,
      });

      projectObj = await projectObj.save();
      return projectObj;
    } catch (error) {
      // console.log(error);
      return 0;
    }
  }

  async addTask(
    task: typeof taskSchema,
    user: typeof userSchema
  ): Promise<typeof taskSchema> {
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
      return 0;
    }
  }
}

export default ProjectClass;
