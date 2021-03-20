const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const _ = require('lodash')
const UserClass = require('../classes/UserClass')
const CapturedTaskClass = require('../classes/CapturedClass')

const userObj = new UserClass()
const capturedObj = new CapturedTaskClass()

router.post('/create', asyncMiddleware(async (req, res) => {
  let {user : email, tasks} = req.body
  tasks = JSON.parse(tasks)
  
  if(!email){
     res.send('error')
  }

  let user = await userObj.isUserNew(email)
  let savedTasks = await capturedObj.createTask(user, tasks)
  
  let response = {
    result : 'success',
    data : savedTasks
  }  
  res.send(response)
}))

router.post('/list', asyncMiddleware(async (req, res) => {
  let user = await userObj.isUserNew(req.body.user)
  let tasks = await capturedObj.getAllTasks(user)
  
  res.send(tasks)     
}))

router.post('/delete', asyncMiddleware(async(req, res) => {
  let {task_id} = req.body
  
  let task = await capturedObj.deleteTask(task_id)

  if(!task) return res.status(404).send("Not found")  
  let response = {
    result : 'success'
  }
  res.send(response)
}))

module.exports = router;