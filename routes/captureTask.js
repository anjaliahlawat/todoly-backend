const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const _ = require('lodash')

const { CapturedTask, validate} = require('../modals/captured')
const { User } = require('../modals/users')

router.post('/create', asyncMiddleware(async (req, res) => {
  let {user, tasks} = req.body
  tasks = JSON.parse(tasks)
  
  if(!user){
     res.send('error')
  }

  let user_id = await User.findOne({ email: user })
  let savedTasks = []
  
  for(let i=0; i < tasks.length; i++){
    const { error } = validate(tasks[i])
    if(error) return res.status(400).send(error.details[0].message)

    let captured = new CapturedTask({
      desc : tasks[i].desc,
      category : tasks[i].category,
      user : user_id,
    })
    captured = await captured.save()
    savedTasks.push(_.pick(captured, ['_id', 'desc', 'category', 'date']))
  }
  let response = {
    result : 'success',
    data : savedTasks
  }  
  res.send(response)
}))

router.post('/list', asyncMiddleware(async (req, res) => {
  let user_id = await User.findOne({ email: req.body.user })
  let tasks = await CapturedTask.find({ user: user_id })
  for(let i=0; i < tasks.length; i++){
     tasks[i] = _.pick(tasks[i], ['_id', 'desc', 'category', 'date'])
  }
  res.send(tasks)     
}))

router.post('/delete', asyncMiddleware(async(req, res) => {
  let {task_id} = req.body
  const task = await CapturedTask.findByIdAndRemove(task_id)

  if(!task) return res.status(404).send("Not found")  
  let response = {
    result : 'success'
  }
  res.send(response)
}))

module.exports = router;