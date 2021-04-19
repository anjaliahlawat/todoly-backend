import Project from "./project";

interface Task {
  _id: string;
  desc: string;
  finishDate: Date;
  from: string;
  img: string;
  moduleId: string;
  path: string;
  project: Project;
  projectId: string;
  reason: string;
  save: () => any;
  status: string;
  to: string;
  type: string;
}

export default Task;
