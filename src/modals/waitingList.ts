import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";

const waitingListSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const WaitingList = model("WaitingList", waitingListSchema);

function validateWaitingList(task: typeof waitingListSchema): JoiObject {
  const schema = {
    desc: string().min(1).max(200).required(),
    date: string().max(100),
  };

  return validate(task, schema);
}

export { WaitingList, waitingListSchema, validateWaitingList };
