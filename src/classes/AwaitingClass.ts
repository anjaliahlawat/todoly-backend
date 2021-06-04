import { pick } from "lodash";

import { isValidDate } from "../util/dateFuncs";
import { OrganizedTask } from "../models/organizedTask";
import { Task } from "../models/task";
import TaskClass from "./TaskClass";
import { User } from "../models/users";
import {
  WaitingListModel,
  validateWaitingList,
  WaitingTask,
} from "../models/waitingList";

type AwaitingRequestObj = Task & OrganizedTask & { reason: string };

class AwaitingClass {
  task: TaskClass;

  constructor() {
    this.task = new TaskClass();
  }

  async addTaskInWaiting(
    task: AwaitingRequestObj,
    from: string,
    user: User
  ): Promise<Task> {
    let waitingObj;

    const { error } = validateWaitingList(pick(task, ["reason"]));
    if (error) throw error;

    if (!task.finishDate || !isValidDate(task.finishDate)) {
      const err = {
        code: "400",
        message: "Invalid Date",
      };
      throw err;
    }

    if (from === "captured") {
      waitingObj = await new WaitingListModel({
        task: task._id,
        reason: task.reason,
        date: task.finishDate,
        user,
      });
    }
    if (from === "organized") {
      waitingObj = await new WaitingListModel({
        organizedTask: task._id,
        reason: task.reason,
        date: task.finishDate,
        user,
      });
    }
    waitingObj = await waitingObj.save();
    return pick(waitingObj, "_id", "reason", "date");
  }

  async delete(ids: Array<string>): Promise<void> {
    for (let i = 0; i < ids.length; i += 1) {
      const task = await WaitingListModel.findByIdAndRemove(ids[i]);
      await this.task.delete(task.task.toString());
    }
  }

  async getAwaitingTaskCount(user: User): Promise<number> {
    const count = await WaitingListModel.where({ user }).count();
    return count;
  }

  async getAwaitingTasks(user: User): Promise<Array<Task>> {
    const waitingtasks = await WaitingListModel.find({ user: user._id });
    const finalTasks = [];
    for (let i = 0; i < waitingtasks.length; i += 1) {
      finalTasks.push({
        ...pick(
          await this.task.getTaskDetails(waitingtasks[i].task.toString()),
          ["desc", "type"]
        ),
        ...pick(waitingtasks[i], ["_id", "reason", "date"]),
      });
    }
    return finalTasks;
  }

  async updateTask(task: AwaitingRequestObj): Promise<WaitingTask> {
    const updatedTask = await WaitingListModel.findByIdAndUpdate(
      { _id: task._id },
      {
        reason: task.reason,
      }
    );
    return updatedTask;
  }
}

export default AwaitingClass;
