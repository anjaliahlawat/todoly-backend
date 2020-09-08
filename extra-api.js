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

router.post('/add/later', asyncMiddleware(async (req, res) =>{
    let {user, tasks, projects, category} = req.body
    // tasks = JSON.parse(tasks)
    let user_id = await User.findOne({ email: user })
    if(!user_id)
       res.send('error')
    
    if(tasks.length > 0){
        for(let i=0; i < tasks.length; i++){
            if(!Task.findById(tasks[i]._id)){
               let later = new LaterTasks({
                  desc : tasks[i].desc,
                  user : user_id
               })
            }
            else
              await Task.findByIdAndUpdate(tasks[i]._id, {isLater: true})
        }
    }
    if(projects.length > 0){
        for(let i=0; i < projects.length; i++){
          await Project.findByIdAndUpdate(projects[i]._id, {isLater: true})
        }
    }
    
}))

router.post('/get/projects', asyncMiddleware(async (req, res) => {
    let { user } = req.body
    let user_id = await User.findOne({ email: user })

    if(!user_id)
       res.send('error')

    let projects = await Project.find({ user: user_id, isLater: false })
    res.send(projects)
}))

router.post('/get/project-task', asyncMiddleware(async (req, res) =>{
   let { user, project } = req.body
   let user_id = await User.findOne({ email: user })
   let project_tasks = []

    if(!user_id)
       res.send('error')

    let modules = await Module.find({ project: project, isAwaited: false, isLater: false })

    if(modules.length > 0){
      let task_ids = []
      let moduleObj = {}

      for(let i=0; i < modules.length; i++){
          task_ids = await Module_task.find({ module : modules[i]._id })
      }

      let new_tasks = []
      for(let i=0; i < task_ids.length; i++){
         new_tasks.push(await Task.find({_id : task_ids[i]._id, isLater : false, isAwaited: false}))
      }
      moduleObj[modules[i].name] = new_tasks      
    }

    let task_ids = await Project_task.find({ project: project })
    let new_tasks = []
    for(let i=0; i < task_ids.length; i++){
        new_tasks.push(await Task.find({_id : task_ids[i]._id, isLater : false, isAwaited: false}))
    }

    project_tasks = {
       tasks : new_tasks,
       modules : moduleObj
    }

    res.send(project_tasks)
}))

router.post('/get/tasks', asyncMiddleware(async (req, res) =>{
    let { user } = req.body
    let user_id = await User.findOne({ email: user })
    let tasks = []

    if(!user_id)
      res.send('error')

    let tasks = await Project.find({ user: user_id, isProject: false, isLater: false, isAwaited: false })
    res.send(projects)
}))

router.post('/get/waiting-list', asyncMiddleware(async (req, res) =>{
    let { user } = req.body
    let user_id = await User.findOne({ email: user })
    let list = []

    if(!user_id)
      res.send('error')

    //add projects
    let projects = await Project.find({ user: user_id, isAwaited: true })
    for(let i=0; i < projects.length; i++){
        
    }
    list['projects'] = projects

    //add modules
    projects = await Project.find({ user: user_id})
    if(projects.length > 0){
      for(let i=0; i < projects.length; i++){
          let modules = await Module.find({project: projects[i]._id, isAwaited: true})
          if(modules.length > 0)
            list['modules'] = {
              project : projects[i].name,
              module : modules,
            }
          else
            list['modules'] = {}
      }

    }

    //add tasks 
    let tasks = await Task.find({user: user_id, isAwaited: true})

    for(let i=0; i < tasks.length; i++){
        if(tasks[i].isProject){
            let project_task = Project_task.findOne({ task : tasks[i]._id })
            let project = Project.findById(project_task._id)
            tasks[i]['project'] = project.name

            //if module exists
            let mod_task = await Module_task.findOne({task : tasks[i]._id})
            if(mod_task){
                let module = await Module.findById(mod_task._id)
                tasks[i]['module'] = module.name
            }
        }

    }
    list['tasks'] = tasks
    res.send(list)
}))

router.post('/get/later', asyncMiddleware(async (req, res) => {
    let { user } = req.body
    let user_id = await User.findOne({ email: user })
    let list = []

    if(!user_id)
      res.send('error')

     //add projects
     let projects = await Project.find({ user: user_id, isLater: true })
     list['projects'] = projects

     //add modules
    projects = await Project.find({ user: user_id})
    if(projects.length > 0){
      for(let i=0; i < projects.length; i++){
          let modules = await Module.find({project: projects[i]._id, isLater: true})
          if(modules.length > 0)
            list['modules'] = {
              project : projects[i].name,
              module : modules,
            }
          else
            list['modules'] = {}
      }
    }

    //add tasks 
    let tasks = await Task.find({user: user_id, isLater: true})

    for(let i=0; i < tasks.length; i++){
        if(tasks[i].isProject){
            let project_task = Project_task.findOne({ task : tasks[i]._id })
            let project = Project.findById(project_task._id)
            tasks[i]['project'] = project.name

            //if module exists
            let mod_task = await Module_task.findOne({task : tasks[i]._id})
            if(mod_task){
                let module = await Module.findById(mod_task._id)
                tasks[i]['module'] = module.name
            }
        }

    }
    list['tasks'] = tasks
    res.send(list)
}))