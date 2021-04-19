import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";
import Task from "../interface/task";

const waitingListSchema = new Schema({
  reason: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  organizedTask: {
    type: Schema.Types.ObjectId,
    ref: "OrganizedTask",
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const WaitingList = model("WaitingList", waitingListSchema);

function validateWaitingList(task: Task): JoiObject {
  const schema = {
    reason: string().min(3).max(200).required(),
  };

  return validate(task, schema);
}

export { WaitingList, validateWaitingList };
