import * as mongoose from "mongoose";
import * as Joi from "joi";

const laterTasksSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const LaterTasks = mongoose.model("LaterTasks", laterTasksSchema);

function validateLaterTasks(tasks: typeof laterTasksSchema): Joi.object {
  const schema = {
    desc: Joi.string().min(1).max(200).required(),
    date: Joi.string().max(100),
  };

  return Joi.validate(tasks, schema);
}

export { LaterTasks, validateLaterTasks };
