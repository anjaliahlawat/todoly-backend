const mongoose = require('mongoose')
const Joi = require('joi')

const moduleSchema = new mongoose.Schema({
  name : {
    type :String,
    required : true,
    minlength : 3,
    maxlength : 100
  },
  isAwaited: {
      type: Boolean,
      default: false
  },
  isLater : {
      type: Boolean,
      default: false
 },
  project : {
    type: mongoose.Schema.Types.ObjectId,
    project: 'Project'
  },
})

const Module = mongoose.model('Module', moduleSchema)

function validateModule(module){
  const schema = {
    name : Joi.string().min(3).max(100).required()
  }

  return Joi.validate(module, schema)
}

exports.Module = Module
exports.validateModule = validateModule