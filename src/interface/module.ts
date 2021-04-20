import Project from "./project";
import Task from "./task";

interface Module {
  _id: string;
  name: string;
  project: Project;
  save: () => any;
  tasks: Array<Task>;
}

export default Module;
