import { Schema, model } from "mongoose";

const waitingTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  waitingList: {
    type: Schema.Types.ObjectId,
    ref: "WaitingList",
  },
});

const WaitingTask = model("WaitingTask", waitingTaskSchema);

export default WaitingTask;
