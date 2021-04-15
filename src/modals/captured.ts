import { Schema, model } from "mongoose";

const capturedTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const CapturedTask = model("CapturedTask", capturedTaskSchema);

export default CapturedTask;
