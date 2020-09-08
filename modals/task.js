const mongoose = require('mongoose')
const Joi = require('joi')

const taskSchema = new mongoose.Schema({
  desc : {
    type :String,
    required : true,
    minlength : 1,
    maxlength : 200
  },
  isProject : {
     type : Boolean,
     default : false
  },
  isLater : {
    type : Boolean,
    default : false
  },
  isAwaited: {
    type : Boolean,
    default : false
  },
  status: {
     type: String,
     default: 'Progress'
  },
  category : {
    type :String,
    required : true,
    minlength : 1,
    maxlength : 100
  },
  date : {
    type: Date,
    default: Date.now, 
    required : true
  },
  finish_date: {
    type: Date,
    required : true
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Task = mongoose.model('Task', taskSchema)

function validateTask(task){
  const schema = {
    desc : Joi.string().min(1).max(200).required(),
    date : Joi.string().max(100),
    finish_date : Joi.string().max(100)
  }

  return Joi.validate(task, schema)
}

exports.Task = Task
exports.validateTask = validateTask