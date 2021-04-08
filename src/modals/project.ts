import mongoose from "mongoose";
import Joi from "joi";

const projectSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Project = mongoose.model("Project", projectSchema);

function validateProject(project: typeof projectSchema): Joi.object {
  const schema = {
    desc: Joi.string().min(1).max(200).required(),
    date: Joi.string().max(100),
  };

  return Joi.validate(project, schema);
}

export { Project, validateProject };
