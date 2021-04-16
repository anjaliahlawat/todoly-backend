import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";
import Project from "../interface/project";

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
  },
  status: {
    type: String,
    default: "To do",
  },
  isAwaited: {
    type: Boolean,
    default: false,
  },
  isLater: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Project = model("Project", projectSchema);

function validateProject(project: Project): JoiObject {
  const schema = {
    name: string().min(1).max(200).required(),
  };

  return validate(project, schema);
}

export { Project, validateProject };
