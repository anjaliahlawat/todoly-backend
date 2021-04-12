import Project from "./project";

interface Module {
  _id: string;
  name: string;
  isLater: boolean;
  isAwaited: boolean;
  project: Project;
  save: () => any;
}

export default Module;
