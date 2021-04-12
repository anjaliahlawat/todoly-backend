import User from "./user";

interface Project {
  _id: string;
  desc: string;
  isLater: boolean;
  isAwaited: boolean;
  status: string;
  date: Date;
  user: User;
  save: () => any;
}

export default Project;
