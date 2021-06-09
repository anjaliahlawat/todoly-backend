import { Schema, model, Document, Types } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

type ID = Types.ObjectId;

interface Project {
  _id: string;
  name: string;
  status: string;
  isAwaited: boolean;
  isLater: boolean;
  date: Date;
  user: ID;
}

interface ProjectDoc extends Project, Document {
  _id: string;
}

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

const ProjectModel = model<ProjectDoc>("Project", projectSchema);

function validateProject(project: Project): JoiObject {
  const schema = {
    name: string().min(3).max(200).required(),
  };

  return validate(project, schema);
}

export { ProjectModel, Project, validateProject };
