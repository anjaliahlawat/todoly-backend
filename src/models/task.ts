import { Schema, model, Document, Types } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

type ID = Types.ObjectId;

interface Task {
  _id: string;
  desc: string;
  type: string;
  user: ID;
}

interface TaskDoc extends Task, Document {
  _id: string;
}

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

const TaskModel = model<TaskDoc>("Task", taskSchema);

function validateTask(task: Task): JoiObject {
  const schema = {
    desc: string().min(3).max(200).required(),
    type: string().min(3).required(),
  };

  return validate(task, schema);
}

export { TaskModel, Task, validateTask };
