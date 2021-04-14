import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

import Task from "../interface/task";

const taskSchema = new Schema({
  desc: {
    type: String,
    required: true,
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

const TaskModal = model("Task", taskSchema);

function validateTask(task: Task): JoiObject {
  const schema = {
    desc: string().min(1).max(200).required(),
    type: string().required(),
  };

  return validate(task, schema);
}

export { TaskModal, validateTask };
