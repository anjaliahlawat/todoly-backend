import { Schema, model, Document, Types } from "mongoose";

type ID = Types.ObjectId;

interface OrganizedTask {
  _id: string;
  task: ID;
  path: string;
  status: string;
  finishDate: Date;
}

interface OrganizedTaskDoc extends OrganizedTask, Document {
  _id: string;
}

const organizedTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  path: {
    type: String,
  },
  status: {
    type: String,
    default: "To do",
  },
  finishDate: {
    type: Date,
    required: true,
  },
});

const OrganizedTaskModel = model<OrganizedTaskDoc>(
  "OrganizedTask",
  organizedTaskSchema
);

export { OrganizedTaskModel, OrganizedTask };
