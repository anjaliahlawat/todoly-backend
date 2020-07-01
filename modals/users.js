const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
  email : {
    type :String,
    required : true,
    minlength : 10,
    maxlength : 50
  },
  password : {
    type :String,
    required : true,
    minlength : 6,
    maxlength : 50
  },
  date : {
    type: Date, 
    required: true,
    default: Date.now
  }
})

const User = mongoose.model('User', userSchema)

function validateUser(user){
  const schema = {
    email : Joi.string().min(10).max(50).required(),
    password : Joi.string().min(6).max(10).required(),
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser