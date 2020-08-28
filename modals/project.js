const mongoose = require('mongoose')
const Joi = require('joi')

const projectSchema = new mongoose.Schema({
  desc : {
    type :String,
    required : true,
    minlength : 1,
    maxlength : 200
  },
  status: {
     type: String,
     default: 'Progress'
  },
  date : {
    type: Date, 
    required: true
  }
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Project = mongoose.model('Project', projectSchema)

function validateProject(project){
  const schema = {
    desc : Joi.string().min(1).max(200).required()
    date : Joi.string().max(100)
  }

  return Joi.validate(project, schema)
}

exports.Project = Project
exports.validate = validateProject