interface Task {
  _id: string;
  desc: string;
  isProject: boolean;
  isLater: boolean;
  isAwaited: boolean;
  status: string;
  date: Date;
  finishDate: Date;
  moduleId: string;
  projectId: string;
  type: string;
  img: string;
  save: () => any;
}

export default Task;
