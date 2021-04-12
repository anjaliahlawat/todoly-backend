import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

const laterTasksSchema = new Schema({
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

const LaterTasks = model("LaterTasks", laterTasksSchema);

function validateLaterTasks(tasks: typeof laterTasksSchema): JoiObject {
  const schema = {
    desc: string().min(1).max(200).required(),
    date: string().max(100),
  };

  return validate(tasks, schema);
}

export { LaterTasks, validateLaterTasks };
