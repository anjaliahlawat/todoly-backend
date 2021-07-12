import { Schema, model, Document, Types } from "mongoose";

type ID = Types.ObjectId;
interface LaterTask {
  _id: string;
  task: ID;
  project: ID;
  user: ID;
}

interface LaterTaskDoc extends LaterTask, Document {
  _id: string;
}

const laterTasksSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const LaterTasksModel = model<LaterTaskDoc>("LaterTasks", laterTasksSchema);

export { LaterTasksModel, LaterTask };
