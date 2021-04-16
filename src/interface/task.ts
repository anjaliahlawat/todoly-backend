import Project from "./project";

interface Task {
  _id: string;
  desc: string;
  finishDate: Date;
  img: string;
  loc: string;
  moduleId: string;
  path: string;
  project: Project;
  projectId: string;
  save: () => any;
  status: string;
  type: string;
}

export default Task;
