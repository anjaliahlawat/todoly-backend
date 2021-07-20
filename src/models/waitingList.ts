import { Schema, model, Document, Types } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

type ID = Types.ObjectId;

interface WaitingTask {
  _id: string;
  reason: string;
  task: ID;
  date: Date;
  user: ID;
}

interface WaitingTaskDoc extends WaitingTask, Document {
  _id: string;
}

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
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const WaitingListModel = model<WaitingTaskDoc>(
  "WaitingList",
  waitingListSchema
);

function validateWaitingList(task: WaitingTask): JoiObject {
  const schema = {
    reason: string().min(3).max(200).required(),
  };

  return validate(task, schema);
}

export { WaitingListModel, validateWaitingList, WaitingTask };
