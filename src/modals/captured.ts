import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const CapturedTask = model("CapturedTask", capturedTaskSchema);

function validateTask(task: typeof capturedTaskSchema): JoiObject {
  const schema = {
    desc: string().min(1).max(200).required(),
    category: string().min(1).max(100).required(),
    date: string().max(100),
  };

  return validate(task, schema);
}

export { CapturedTask, validateTask };
