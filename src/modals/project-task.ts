import mongoose from "mongoose";

const projectTaskSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    task: "Task",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    project: "Project",
  },
});

const ProjectTask = mongoose.model("ProjectTask", projectTaskSchema);
export default ProjectTask;
