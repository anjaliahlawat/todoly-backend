const { Module, validateModule} = require('../modals/module')
const { Module_task } = require('../modals/module-task')
const TaskClass = require('./TaskClass')

const taskObj = new TaskClass()

class ModuleClass {
  async createModule(module, project){
    try {
      let module = new Module({
        name : module.name,
        project : project
      })
      return await module.save()
    } catch (error) {
      console.log(error)
    }   
  }
  async addTask(task, user){
    let savedTask = await taskObj.createTask(task, true, user)

    let module_task = new Module_task({
      module : task.module_id,
      task : savedTask._id
    })

    module_task = await module_task.save()

    return savedTask
  }
  async editModule(){

  }
  async deleteModule(){

  }
}

module.exports = ModuleClass