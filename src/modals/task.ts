import * as mongoose from "mongoose";
import * as Joi from "joi";

const taskSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
  },
  isProject: {
    type: Boolean,
    default: false,
  },
  isLater: {
    type: Boolean,
    default: false,
  },
  isAwaited: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Progress",
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  finish_date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = mongoose.model("Task", taskSchema);

function validateTask(task: typeof taskSchema): Joi.object {
  const schema = {
    desc: Joi.string().min(1).max(200).required(),
    date: Joi.string().max(100),
    finish_date: Joi.string().max(100),
  };

  return Joi.validate(task, schema);
}

export { Task, validateTask };
