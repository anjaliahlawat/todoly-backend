import { pick } from "lodash";

import Task from "../interface/task";
import TaskClass from "./TaskClass";
import User from "../interface/user";
import { WaitingList, validateWaitingList } from "../modals/waitingList";

class AwaitingClass {
  task: TaskClass;

  constructor() {
    this.task = new TaskClass();
  }

  async addTaskInWaiting(task: Task, user: User): Promise<Task> {
    let waitingObj;

    const { error } = validateWaitingList(pick(task, ["reason"]));
    if (error) throw error.details[0].message;

    if (task.from === "captured") {
      waitingObj = await new WaitingList({
        task: task._id,
        reason: task.reason,
        date: task.finishDate,
        user,
      });
    }
    if (task.from === "organized") {
      waitingObj = await new WaitingList({
        organizedTask: task._id,
        reason: task.reason,
        date: task.finishDate,
        user,
      });
    }
    waitingObj = await waitingObj.save();
    return pick(waitingObj, "_id", "reason", "date");
  }

  async getAwaitingTaskCount(user: User): Promise<number> {
    const count = await WaitingList.where({ user }).count();
    return count;
  }

  async getAwaitingTasks(user: User): Promise<Array<Task>> {
    const waitingtasks = await WaitingList.find({ user });
    const finalTasks = [];
    for (let i = 0; i < waitingtasks.length; i += 1) {
      finalTasks.push({
        ...pick(await this.task.getTaskDetails(waitingtasks[i].task), [
          "desc",
          "type",
        ]),
        ...pick(waitingtasks[i], ["_id", "reason", "date"]),
      });
    }
    return finalTasks;
  }
}

export default AwaitingClass;
