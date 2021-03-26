const { Project, validateProject } = require("../modals/project");
const { Task, validateTask } = require("../modals/task");
const { Project_task } = require("../modals/project-task");

const ModuleClass = require("./ModuleClass");
const TaskClass = require("./TaskClass");

const moduleObj = new ModuleClass();
const taskObj = new TaskClass();

class ProjectClass {
  async createProject(project, user_id) {
    try {
      let project = new Project({
        desc: project.desc,
        user: user_id,
      });

      project = await project.save();
      return project;
    } catch (error) {
      console.log(error);
    }
  }

  async addTask(task, user) {
    try {
      let savedTask = {};
      if (task.module) {
        savedTask = await moduleObj.addTask(task, user);
      } else {
        savedTask = await taskObj.addTask(task, true, user);
        let project_task = new Project_task({
          project: task.project_id,
          task: savedTask._id,
        });

        project_task = await project_task.save();
      }

      return savedTask;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProjectClass;
