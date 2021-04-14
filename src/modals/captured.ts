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
  type: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const CapturedTask = model("CapturedTask", capturedTaskSchema);

export default CapturedTask;
