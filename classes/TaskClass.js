class TaskClass {
  async createTask(task, project=false, user){
    try {
      let task = new Task({
        desc : task.desc,
        category : category,
        isProject : project,
        finish_date : task.finish_date,
        user : user
      })
      return await task.save() 
    } catch (error) {
      console.log(error) 
    }   
  }

  async editTask(){

  }

  async deleteTask(){

  }
}

module.exports = TaskClass