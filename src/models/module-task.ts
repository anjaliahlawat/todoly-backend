import { Schema, model, Document, Types } from "mongoose";

type ID = Types.ObjectId;

interface ModuleTask {
  _id: string;
  task: ID;
  module: ID;
}

interface ModuleTaskDoc extends ModuleTask, Document {
  _id: string;
}

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

const ModuleTaskModel = model<ModuleTaskDoc>(
  "ModuleTaskModel",
  moduleTaskSchema
);

export { ModuleTaskModel, ModuleTask };
