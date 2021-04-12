import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

const moduleSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  isAwaited: {
    type: Boolean,
    default: false,
  },
  isLater: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Schema.Types.ObjectId,
    project: "Project",
  },
});

const Module = model("Module", moduleSchema);

function validateModule(module: typeof moduleSchema): JoiObject {
  const schema = {
    name: string().min(3).max(100).required(),
  };

  return validate(module, schema);
}

export { Module, moduleSchema, validateModule };
