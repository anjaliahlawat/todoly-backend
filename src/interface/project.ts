import Task from "./task";
import User from "./user";

interface Project {
  _id: string;
  date: Date;
  isLater: boolean;
  isAwaited: boolean;
  name: string;
  save: () => any;
  status: string;
  tasks: Array<Task>;
  user: User;
}

export default Project;
