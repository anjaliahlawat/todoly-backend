const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const _ = require('lodash')

const { Project, validateProject} = require('../modals/project')
// const { Task, validateTask} = require('../modals/task')
// const { Module, validateModule} = require('../modals/module')
// const { Module_task } = require('../modals/module-task')
// const { Project_task, validatePTask} = require('../modals/project-task')
// const { WaitingTask, validateWaitngTask} = require('../modals/waitingtask')
const { User } = require('../modals/users')

router.post('/add/project', asyncMiddleware(async (req, res) => {
    let {user, projects} = req.body
    // projects = JSON.parse(projects)
    let user_id = await User.findOne({ email: user })

    if(!user){
      res.send('error')
    }

    for(let i=0; i < projects.length; i++){
      let project = new Project({
         desc : projects[i].desc,
         category : projects[i].category,
         user : user_id,
      })
      project = await project.save()
    }
    let response = {
      result : 'success'
    }
    res.send(response)
}))

router.post('/add/task', asyncMiddleware(async (req, res) => {
  let user_id = await User.findOne({ email: req.body.user })
  
     
}))

router.post('/add/module', asyncMiddleware(async (req, res) => {
  let user_id = await User.findOne({ email: req.body.user })
  
     
}))

router.post('/add/waiting-list', asyncMiddleware(async (req, res) => {
  let user_id = await User.findOne({ email: req.body.user })
  
     
}))

module.exports = router;