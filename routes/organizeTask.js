const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const _ = require('lodash')
const { Project, validateProject} = require('../modals/project')
const { Task, validateTask} = require('../modals/task')
const { Module, validateModule} = require('../modals/module')
const { Module_task } = require('../modals/module-task')
const { Project_task} = require('../modals/project-task')
const { WaitingTask} = require('../modals/waitingTask')
const { WaitingList, validateWaitingList} = require('../modals/waitingList')
const { LaterTasks, validateLaterTasks} = require('../modals/later')
const { User } = require('../modals/users')

router.post('/add/project', asyncMiddleware(async (req, res) => {
    let {user, projects} = req.body
    // projects = JSON.parse(projects)
    let user_id = await User.findOne({ email: user })
    let save_projects = []

    if(!user_id){
      res.send('error')
    }

    for(let i=0; i < projects.length; i++){
        let project = new Project({
          desc : projects[i].desc,
          category : projects[i].category,
          user : user_id,
        })
        project = await project.save()
        save_projects.push(project)
    }
    let response = {
      result : 'success',
      projects : save_projects
    }
    res.send(response)
}))

router.post('/add/task', asyncMiddleware(async (req, res) => {
    let {user, tasks, category} = req.body
    // tasks = JSON.parse(tasks)
    let user_id = await User.findOne({ email: user })
    let save_tasks = []

    if(!user_id){
       res.send('error')
    }
    for(let i=0; i < tasks.length; i++){
        let task = new Task({
          desc : tasks[i].desc,
          category : category,
          finish_date : tasks[i].finish_date,
          user : user_id
        })
        task = await task.save()
        save_tasks.push(task)
    }
    let response = {
      result : 'success',
      tasks : save_tasks
    }
    res.send(response)     
}))

router.post('/add/project-task', asyncMiddleware(async (req, res) => {
    let {user, tasks, category, project_id} = req.body
    // tasks = JSON.parse(tasks)
    let user_id = await User.findOne({ email: user })
    let save_tasks = []

    if(!user_id){
      res.send('error')
    }
    for(let i=0; i < tasks.length; i++){
        let task = new Task({
          desc : tasks[i].desc,
          category : category,
          isProject : true,
          finish_date : tasks[i].finish_date,
          user : user_id
        })
        task = await task.save()
        let project_task = new Project_task({
          project : project_id,
          task : task._id
        })
        project_task = await project_task.save()
        save_tasks.push(task)
    }
    let response = {
      result : 'success',
      tasks : save_tasks
    }
    res.send(response)
}))

router.post('/add/module', asyncMiddleware(async (req, res) => {
    let {user, modules, category, project_id} = req.body
    // modules = JSON.parse(modules)
    let user_id = await User.findOne({ email: user })
    let save_modules = []
    let save_tasks = []

   if(!user_id){
      res.send('error')
   }
   for(let i=0; i < modules.length; i++){       
        let module = new Module({
           name : modules[i].name,
           project : project_id
        })
        module = await module.save()
        save_modules.push(module)

        let tasks = modules[i].tasks
        for(let j=0; j < tasks.length; j++){
            let task = new Task({
              desc : tasks[i].desc,
              category : category,
              isProject : true,
              finish_date : tasks[i].finish_date,
              user : user_id
            })
            task = await task.save()
            save_tasks.push(task)

            let module_task = new Module_task({
               task : task._id,
               module : module._id
            })

            module_task = await module_task.save()
        }
    }
    let response = {
      result : 'success',
      tasks : save_tasks,
      modules : save_modules
    }
    res.send(response)
     
}))

router.post('/add/waiting-list', asyncMiddleware(async (req, res) => {
  let {user, tasks, category} = req.body
  // tasks = JSON.parse(tasks)
  let user_id = await User.findOne({ email: user })

  if(!user_id)
     res.send('error')
  
  for(let i=0; i < tasks.length; i++){
    if(Task.findById(tasks[i]._id)){
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
    else{
        let wlist = new WaitingList({
            reason : tasks[i].reason,
            date : tasks[i].date,
            user : user_id
        })
        wlist = wlist.save()
    }
  }
  let response = {
    result : 'success'
  }
  res.send(response)
}))

module.exports = router;