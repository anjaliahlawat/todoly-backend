import { Schema, model } from "mongoose";

const projectTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    task: "Task",
  },
  project: {
    type: Schema.Types.ObjectId,
    project: "Project",
  },
});

const ProjectTask = model("projecttasks", projectTaskSchema);

export default ProjectTask;
