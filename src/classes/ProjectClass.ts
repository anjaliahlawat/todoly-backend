import { Project as ProjectModal } from "../modals/project";
import User from "../interface/user";
import Project from "../interface/project";
import Task from "../interface/task";
import ProjectTask from "../modals/project-task";

class ProjectClass {
  async addProject(project: Project, user: User): Promise<Project> {
    const projectObj = await this.getProject(project.name);
    if (projectObj.length === 0) {
      return this.createProject(project, user);
    }
    return projectObj[0];
  }

  private async getProject(name): Promise<Array<Project>> {
    return ProjectModal.find({ name });
  }

  async getAllProjects(user: User): Promise<Array<Project>> {
    const projects = await ProjectModal.find({ user });
    return projects;
  }

  async getProjectCount(user: User): Promise<number> {
    const count = await ProjectModal.where({ user }).count();
    return count;
  }

  private async createProject(project: Project, user: User): Promise<Project> {
    const projectObj = new ProjectModal({
      name: project.name,
      user,
    });
    return projectObj.save();
  }

  async addTaskToProject(project: Project, task: Task): Promise<void> {
    const projectTask = await new ProjectTask({ task, project });
    projectTask.save();
  }
}

export default ProjectClass;
