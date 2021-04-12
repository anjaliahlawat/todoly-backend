import { Schema, model } from "mongoose";
import { validate, object as JoiObject, string } from "joi";
import { sign } from "jsonwebtoken";
import { get as getConfigVar } from "config";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

userSchema.methods.getAuthToken = function (): string {
  const token = sign({ _id: this._id }, getConfigVar("jwtPrivateKey"));
  return token;
};

const User = model("User", userSchema);

function validateUser(user: typeof userSchema): JoiObject {
  const schema = {
    username: string().min(5).max(50).required(),
    email: string().min(10).max(255).required(),
    phoneNumber: string().min(10).required(),
    password: string().min(6).max(1024).required(),
  };

  return validate(user, schema);
}

export { User, userSchema, validateUser };
