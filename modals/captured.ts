const mongoose = require("mongoose");
const Joi = require("joi");

const capturedTaskSchema = new mongoose.Schema({
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

const CapturedTask = mongoose.model("CapturedTask", capturedTaskSchema);

function validateTask(task) {
  const schema = {
    desc: Joi.string().min(1).max(200).required(),
    category: Joi.string().min(1).max(100).required(),
    date: Joi.string().max(100),
  };

  return Joi.validate(task, schema);
}

export { CapturedTask, validateTask };
