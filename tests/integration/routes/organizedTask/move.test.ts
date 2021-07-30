import * as request from "supertest";

import { addDaysToCurrentDate } from "../../../../src/util/dateFuncs";
import { LaterTasksModel } from "../../../../src/models/later";
import { OrganizedTaskModel } from "../../../../src/models/organizedTask";
import { ModuleModel } from "../../../../src/models/module";
import { ModuleTaskModel } from "../../../../src/models/module-task";
import { ProjectModel } from "../../../../src/models/project";
import { ProjectTaskModel } from "../../../../src/models/project-task";
import server from "../../../../src/index";
import { TaskModel } from "../../../../src/models/task";
import { UserModel } from "../../../../src/models/users";
import { WaitingListModel } from "../../../../src/models/waitingList";
import {
  awaitingTask,
  laterTask,
  simpleTask,
  project as projects,
} from "../../../../assets/qa.json";
import createPath from "../../../../src/util/helper";

describe("Organize task Api / Move Folders/Files", () => {
  let token: string;
  let project: any;
  let module: any;
  let orgTask1: any;
  let awaitingTask1: any;

  const url = "/api/organize";
  const user = "60c307e88b487f562811b895";

  beforeAll(async () => {
    token = new UserModel().getAuthToken();

    // adding simple task
    let task1 = new TaskModel({ desc: simpleTask[0], type: "text", user });
    task1 = await task1.save();

    let task2 = new TaskModel({ desc: simpleTask[1], type: "text", user });
    task2 = await task2.save();

    orgTask1 = new OrganizedTaskModel({
      task: task1._id,
      path: "simple-task",
      finishDate: addDaysToCurrentDate(3),
    });
    orgTask1 = await orgTask1.save();

    const orgTask2 = new OrganizedTaskModel({
      task: task2._id,
      path: "simple-task",
      finishDate: addDaysToCurrentDate(3),
    });
    await orgTask2.save();

    // adding later tasks
    let task3 = new TaskModel({ desc: laterTask[0], type: "text", user });
    task3 = await task3.save();

    let task4 = new TaskModel({ desc: laterTask[1], type: "text", user });
    task4 = await task4.save();

    const laterTask1 = new LaterTasksModel({
      task: task3._id,
      user,
    });
    await laterTask1.save();

    const laterTask2 = new LaterTasksModel({
      task: task4._id,
      user,
    });
    await laterTask2.save();

    // adding waiting task
    let task5 = new TaskModel({
      desc: awaitingTask[0].desc,
      type: "text",
      user,
    });
    task5 = await task5.save();

    let task6 = new TaskModel({
      desc: awaitingTask[1].desc,
      type: "text",
      user,
    });
    task6 = await task6.save();

    awaitingTask1 = new WaitingListModel({
      task: task5._id,
      reason: awaitingTask[0].reason,
      date: addDaysToCurrentDate(3),
      user,
    });
    awaitingTask1 = await awaitingTask1.save();

    const awaitingTask2 = new WaitingListModel({
      task: task6._id,
      reason: awaitingTask[1].reason,
      date: addDaysToCurrentDate(3),
      user,
    });
    awaitingTask2.save();

    // adding project & modules
    let task7 = new TaskModel({
      desc: projects[1].tasks[0].desc,
      type: "text",
      user,
    });
    task7 = await task7.save();

    let task8 = new TaskModel({
      desc: projects[1].modules[0].tasks[0].desc,
      type: "text",
      user,
    });
    task8 = await task8.save();

    const projectName = projects[1].name;
    const moduleName = projects[1].modules[0].name;
    const projectPath = `project/${createPath(projectName)}`;
    const modulePath = `project/${createPath(projectName, moduleName)}`;

    project = new ProjectModel({ name: projectName, user });
    project = await project.save();

    module = new ModuleModel({ name: moduleName, project });
    module = await module.save();

    const projectOrgTask = new OrganizedTaskModel({
      task: task7,
      projectPath,
      finishDate: addDaysToCurrentDate(3),
    });
    await projectOrgTask.save();

    const projectTask = new ProjectTaskModel({
      task: projectOrgTask,
      project,
    });
    await projectTask.save();

    // module task
    const moduleOrgTask = new OrganizedTaskModel({
      task: task8,
      modulePath,
      finishDate: addDaysToCurrentDate(3),
    });
    await moduleOrgTask.save();

    const moduleTask = new ModuleTaskModel({
      task: moduleOrgTask,
      module,
    });
    await moduleTask.save();
  });

  afterAll(async () => {
    server.close();
    await TaskModel.remove({});
    await LaterTasksModel.remove({});
    await ModuleModel.remove({});
    await ModuleTaskModel.remove({});
    await OrganizedTaskModel.remove({});
    await ProjectModel.remove({});
    await ProjectTaskModel.remove({});
    await WaitingListModel.remove({});
  });

  it("should move simple-task to later", async () => {
    const formData = {
      user: {
        _id: user,
      },
      from: "simple-task",
      folderId: orgTask1._id,
      to: "later",
    };

    const res = await request(server)
      .post(`${url}/folder/move`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");

    const orgTask = await OrganizedTaskModel.findById(orgTask1._id);
    expect(orgTask).toBe(null);

    const task = await LaterTasksModel.find({ task: orgTask1.task });
    expect(task).toHaveLength(1);
  });

  it("should move awaiting to later", async () => {
    const formData = {
      user: {
        _id: user,
      },
      from: "awaiting",
      folderId: awaitingTask1._id,
      to: "later",
    };

    const res = await request(server)
      .post(`${url}/folder/move`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");

    const waitingTask = await WaitingListModel.findById(awaitingTask1._id);
    expect(waitingTask).toBe(null);

    const task = await LaterTasksModel.find({ task: awaitingTask1.task });
    expect(task).toHaveLength(1);
  });

  it("should move project to later", async () => {
    const formData = {
      user: {
        _id: user,
      },
      from: "project",
      folderId: project._id,
      to: "later",
    };

    const res = await request(server)
      .post(`${url}/folder/move`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");

    const movedProject = await ProjectModel.findById(project._id);
    expect(movedProject.isLater).toBe(true);

    const projectTasks = await ProjectTaskModel.find({ project: project._id });
    expect(projectTasks).toHaveLength(0);

    const modules = await ModuleModel.find({ project: project._id });
    expect(modules).toHaveLength(0);

    const moduleTasks = await ModuleTaskModel.find({ module: module._id });
    expect(moduleTasks).toHaveLength(0);

    const later = await LaterTasksModel.find({ project: project._id });
    expect(later).toHaveLength(1);
  });

  // it("should move module to later", async () => {

  // });

  // it("should move project-task to later", async () => {

  // });

  // it("should move project-task to awaiting", async () => {

  // });

  // it("should move module-task to later", async () => {

  // });

  // it("should move module-task to awaiting", async () => {

  // });
});
