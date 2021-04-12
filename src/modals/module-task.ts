import { Schema, model } from "mongoose";

const moduleTaskSchema = new Schema({
  module: {
    type: Schema.Types.ObjectId,
    module: "Module",
  },
  task: {
    type: Schema.Types.ObjectId,
    task: "task",
  },
});

const ModuleTask = model("ModuleTask", moduleTaskSchema);

export default ModuleTask;
