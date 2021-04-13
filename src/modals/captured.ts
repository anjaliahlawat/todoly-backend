import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";
import Task from "../interface/task";

const capturedTaskSchema = new Schema({
  desc: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const CapturedTask = model("CapturedTask", capturedTaskSchema);

function validateTask(task: Task): JoiObject {
  const schema = {
    desc: string().min(1).max(200).required(),
    type: string().required(),
  };

  return validate(task, schema);
}

export { CapturedTask, validateTask };
