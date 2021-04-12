import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

const taskSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = model("Task", taskSchema);

function validateTask(task: typeof taskSchema): JoiObject {
  const schema = {
    desc: string().min(1).max(200).required(),
    date: string().max(100),
    finish_date: string().max(100),
  };

  return validate(task, schema);
}

export { Task, taskSchema, validateTask };
