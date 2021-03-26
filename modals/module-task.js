const mongoose = require("mongoose");
const Joi = require("joi");

const module_taskSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    module: "Module",
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    task: "task",
  },
});

const Module_task = mongoose.model("Module_task", module_taskSchema);
exports.Module_task = Module_task;
