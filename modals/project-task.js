const mongoose = require("mongoose");
const Joi = require("joi");

const project_taskSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    task: "Task",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    project: "Project",
  },
});

const Project_task = mongoose.model("Project_task", project_taskSchema);
exports.Project_task = Project_task;
