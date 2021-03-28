const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const _ = require('lodash')

// const { WaitingTask} = require('../modals/waitingTask')
// const { WaitingList, validateWaitingList} = require('../modals/waitingList')
// const { LaterTasks, validateLaterTasks} = require('../modals/later')
const UserClass = require('../classes/UserClass')
const ProjectClass = require('../classes/ProjectClass')
const ModuleClass = require('../classes/ModuleClass')
const TaskClass = require('../classes/TaskClass')

const userObj = new UserClass()
const projectObj = new ProjectClass()
const moduleObj = new ModuleClass()
const taskObj = new TaskClass()

router.post('/add/project', asyncMiddleware(async (req, res) => {
    let {user, project} = req.body
    let user_id = await userObj.getUserId(user)

    if(!user_id){
      res.send('error')
    }

    let project = await projectObj.createProject(project, user)

    let response = {
      result : 'success',
      project : project
    }
    res.send(response)
}))

router.post('/add/module', asyncMiddleware(async (req, res) => {
  let {user, module, project_id} = req.body
  let user_id = await userObj.getUserId(user)

  if(!user_id){
      res.send('error')
  }

  let savedModule = await moduleObj.createModule(module, project_id)
  let response = {
    result : 'success',
    module : module
  }
  res.send(response)   
}))

router.post('/add/task', asyncMiddleware(async (req, res) => {
    let {user, task} = req.body
    let user_id = await User.findOne({ email: user })
    let saveTask = {}

    if(!user_id){
       res.send('error')
    }

    if(task.project){
      savedTask = await projectObj.addTask(task, user)
    }
    else{
      saveTask = await taskObj.createTask(task, false, user)
    }
    let response = {
      result : 'success',
      tasks : savedTask
    }
    res.send(response)     
}))

router.post('/add/waiting-list', asyncMiddleware(async (req, res) => {
  let {user, newTasks, tasks, projects, modules} = req.body
  // tasks = JSON.parse(tasks)
  let user_id = await User.findOne({ email: user })

  if(!user_id)
     res.send('error')
  
  if(tasks.length > 0){
    for(let i=0; i < tasks.length; i++){
        await Task.findByIdAndUpdate(tasks[i]._id, {isAwaited: true })
        let wlist = new WaitingList({
          reason : tasks[i].reason,
          date : tasks[i].date,
          user : user_id
        })
        wlist = wlist.save()

        let wtask = new WaitingTask({
          task : task._id,
          waitingList : wlist._id
        })
        wtask = await wtask.save()
    }
  }

  if(newTasks.length > 0){
      for(let i=0; i < newTasks.length; i++){
          let task = new Task({
              desc : newTasks[i].desc,
              category : newTasks[i].category,
              finish_date : tasks[i].finish_date,
              user : user_id
          })
          task = task.save()

          let wlist = new WaitingList({
              reason : newTasks[i].reason,
              date : newTasks[i].date,
              user : user_id
          })
          w_list = wlist.save()

          let w_task = new WaitingTask({
             task : task._id,
             waitingList : w_list._id
          })     
          w_task= w_task.save()     
      }
  } 

  if(projects.length > 0){
      for(let i=0; i < projects.length; i++){
         await Project.findByIdAndUpdate(projects[i]._id, { isAwaited : true })
      }
  }

  if(modules.length > 0){
      for(let i=0; i < modules.length; i++){
          await Module.findByIdAndUpdate(modules[i]._id, { isAwaited : true })
      }
  }
  let response = {
    result : 'success'
  }
  res.send(response)
}))

module.exports = router;