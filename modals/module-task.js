const mongoose = require('mongoose')
const Joi = require('joi')

const module_taskSchema = new mongoose.Schema({
  module : {
    type: mongoose.Schema.Types.ObjectId,
    module: 'Module'
  }
  project : {
    type: mongoose.Schema.Types.ObjectId,
    project: 'Project'
  }
})

const Module_task = mongoose.model('Module_task', module_taskSchema)
exports.Module_task = Module_task