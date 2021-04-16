import { Schema, model } from "mongoose";

const organizedTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  path: {
    type: String,
  },
  status: {
    type: String,
    default: "Progress",
  },
  finish_date: {
    type: Date,
    required: true,
  },
});

const OrganizedTask = model("organizedtask", organizedTaskSchema);

export default OrganizedTask;
