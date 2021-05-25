import { Schema, model, Document, Types } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

type ID = Types.ObjectId;

interface Module {
  _id: string;
  name: string;
  project: ID;
}

interface ModuleDoc extends Module, Document {
  _id: string;
}

const moduleSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  project: {
    type: Schema.Types.ObjectId,
    project: "Project",
  },
});

const ModuleModel = model<ModuleDoc>("Module", moduleSchema);

function validateModule(module: Module): JoiObject {
  const schema = {
    name: string().min(3).max(100).required(),
  };

  return validate(module, schema);
}

export { ModuleModel, Module, validateModule };
