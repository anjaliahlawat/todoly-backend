import * as mongoose from "mongoose";
import * as Joi from "joi";
import * as jwt from "jsonwebtoken";
import * as config from "config";

const userSchema = new mongoose.Schema({
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
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user: typeof userSchema): Joi.object {
  const schema = {
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(10).max(255).required(),
    phoneNumber: Joi.string().min(10).required(),
    password: Joi.string().min(6).max(1024).required(),
  };

  return Joi.validate(user, schema);
}

export { User, userSchema, validateUser };
