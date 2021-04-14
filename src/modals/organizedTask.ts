import { Schema, model } from "mongoose";

const organizedTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  isProject: {
    type: Boolean,
    default: false,
  },
  isLater: {
    type: Boolean,
    default: false,
  },
  isAwaited: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Progress",
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  finish_date: {
    type: Date,
    required: true,
  },
});

const OrganizedTask = model("Organizedtask", organizedTaskSchema);

export default OrganizedTask;
