import { Schema, model, Document, Types } from "mongoose";

type ID = Types.ObjectId;

interface ProjectTask {
  _id: string;
  reason: string;
  task: ID;
  date: Date;
  user: ID;
}

interface ProjectTaskDoc extends ProjectTask, Document {
  _id: string;
}

const projectTaskSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    task: "Task",
  },
  project: {
    type: Schema.Types.ObjectId,
    project: "Project",
  },
});

const ProjectTaskModel = model<ProjectTaskDoc>(
  "projecttasks",
  projectTaskSchema
);

export { ProjectTaskModel, ProjectTask };
