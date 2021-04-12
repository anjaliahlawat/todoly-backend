import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

const projectSchema = new Schema({
  desc: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
  },
  status: {
    type: String,
    default: "In Progress",
  },
  isAwaited: {
    type: Boolean,
    default: false,
  },
  isLater: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Project = model("Project", projectSchema);

function validateProject(project: typeof projectSchema): JoiObject {
  const schema = {
    desc: string().min(1).max(200).required(),
    date: string().max(100),
  };

  return validate(project, schema);
}

export { Project, projectSchema, validateProject };
