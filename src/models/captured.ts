import { Schema, model, Document, Types } from "mongoose";

type ID = Types.ObjectId;

interface CapturedTask {
  _id: string;
  task: ID;
  date: Date;
}

interface CapturedTaskDoc extends CapturedTask, Document {
  _id: string;
}

const capturedTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const CapturedTaskModel = model<CapturedTaskDoc>(
  "CapturedTask",
  capturedTaskSchema
);

export { CapturedTaskModel, CapturedTask };
