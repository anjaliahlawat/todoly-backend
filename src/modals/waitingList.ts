import * as mongoose from "mongoose";
import * as Joi from "joi";

const waitingListSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const WaitingList = mongoose.model("WaitingList", waitingListSchema);

function validateWaitingList(task: typeof waitingListSchema): Joi.object {
  const schema = {
    desc: Joi.string().min(1).max(200).required(),
    date: Joi.string().max(100),
  };

  return Joi.validate(task, schema);
}

exports.WaitingList = WaitingList;
exports.validateWaitingList = validateWaitingList;
