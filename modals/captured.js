const mongoose = require('mongoose')
const Joi = require('joi')

const capturedTaskSchema = new mongoose.Schema({
  desc : {
    type :String,
    required : true,
    minlength : 3,
    maxlength : 200
  },
  category : {
    type :String,
    required : true,
    minlength : 3,
    maxlength : 100
  },
  date : {
    type: Date, 
    required: true,
    default: Date.now
  }
})

const CapturedTask = mongoose.model('CapturedTask', capturedTaskSchema)

function validateTask(task){
  const schema = {
    desc : Joi.string().min(3).max(200).required(),
    category : Joi.string().min(3).max(100).required()
  }

  return Joi.validate(task, schema)
}

exports.CapturedTask = CapturedTask
exports.validate = validateTask