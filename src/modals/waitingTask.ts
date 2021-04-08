import * as mongoose from "mongoose";

const waitingTaskSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  waitingList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WaitingList",
  },
});

const WaitingTask = mongoose.model("WaitingTask", waitingTaskSchema);

export default WaitingTask;
