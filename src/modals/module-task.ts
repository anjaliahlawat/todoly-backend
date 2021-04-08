import * as mongoose from "mongoose";

const moduleTaskSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    module: "Module",
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    task: "task",
  },
});

const ModuleTask = mongoose.model("ModuleTask", moduleTaskSchema);

export default ModuleTask;
