const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
  name : {
    type :String,
    required : true,
    minlength : 5,
    maxlength : 50
  },
  email : {
    type :String,
    required : true,
    minlength : 10,
    maxlength : 255
  },
  password : {
    type :String,
    required : true,
    minlength : 6,
    maxlength : 1024
  },
  date : {
    type: Date, 
    required: true,
    default: Date.now
  },
  phoneNo : {
    type : Number,
    required : true,
    maxlength : 10,
    minlength : 10
  }
})

const User = mongoose.model('User', userSchema)

function validateUser(user){
  const schema = {
    name : Joi.string().min(5).max(50).required(),
    email : Joi.string().min(10).max(255).required(),
    password : Joi.string().min(6).max(1024).required(),
    phoneNo : Joi.string().min(10).max(10).required(),
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser