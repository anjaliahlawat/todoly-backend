import { Schema, model } from "mongoose";

const laterTasksSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  organizedTask: {
    type: Schema.Types.ObjectId,
    ref: "OrganizedTask",
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const LaterTasks = model("LaterTasks", laterTasksSchema);

export default LaterTasks;
