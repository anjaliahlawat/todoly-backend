const mongoose = require('mongoose')
const Joi = require('joi')

const waitingTaskSchema = new mongoose.Schema({
  reason : {
    type :String,
    required : true,
    minlength : 3,
    maxlength : 200
  },
  date : {
    type: Date, 
    required: true,
    default: Date.now
  },
  task : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }
})

const WaitingTask = mongoose.model('WaitingTask', waitingTaskSchema)

function validateWaitngTask(task){
  const schema = {
    desc : Joi.string().min(1).max(200).required(),
    date : Joi.string().max(100)
  }

  return Joi.validate(task, schema)
}

exports.WaitingTask = WaitingTask
exports.validateWaitngTask = validateWaitngTask