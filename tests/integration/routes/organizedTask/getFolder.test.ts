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

describe("Organize task Api / Get Folders", () => {
  let token: string;
  let project: any;
  let module: any;

  const url = "/api/organize";
  const user = "60c307e88b487f562811b895";

  const formData = {
    user: {
      _id: user,
    },
  };

  beforeAll(async () => {
    token = new UserModel().getAuthToken();

    // adding simple task
    let task1 = new TaskModel({ desc: simpleTask[0], type: "text", user });
    task1 = await task1.save();

    let task2 = new TaskModel({ desc: simpleTask[1], type: "text", user });
    task2 = await task2.save();

    const orgTask1 = new OrganizedTaskModel({
      task: task1._id,
      path: "simple-task",
      finishDate: addDaysToCurrentDate(3),
    });
    await orgTask1.save();

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

    const awaitingTask1 = new WaitingListModel({
      task: task5._id,
      reason: awaitingTask[0].reason,
      date: addDaysToCurrentDate(3),
      user,
    });
    await awaitingTask1.save();

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

  it("should get all the base folders", async () => {
    const res = await request(server)
      .post(`${url}/folders`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folders).toHaveLength(4);
    expect(res.body.folders).toEqual([
      { title: "Simple tasks", subtitle: "2 tasks", total: 2 },
      { title: "Projects", subtitle: "1 projects", total: 1 },
      { title: "Waiting", subtitle: "2 awaiting", total: 2 },
      { title: "Later", subtitle: "2 tasks", total: 2 },
    ]);
  });

  it("should get the simple tasks inside base folders", async () => {
    const res = await request(server)
      .post(`${url}/folders/simple-task`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folderData).toHaveLength(2);
    expect(res.body.folderData[0].desc).toBe(simpleTask[0]);
    expect(res.body.folderData[0]._id).not.toBeNull();
    expect(res.body.folderData[1].desc).toBe(simpleTask[1]);
    expect(res.body.folderData[1]._id).not.toBeNull();
  });

  it("should get the later tasks inside base folders", async () => {
    const res = await request(server)
      .post(`${url}/folders/later`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folderData).toHaveLength(2);
    expect(res.body.folderData[0].desc).toBe(laterTask[0]);
    expect(res.body.folderData[0]._id).not.toBeNull();
    expect(res.body.folderData[1].desc).toBe(laterTask[1]);
    expect(res.body.folderData[1]._id).not.toBeNull();
  });

  it("should get the awaiting tasks inside base folders", async () => {
    const res = await request(server)
      .post(`${url}/folders/awaiting`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folderData).toHaveLength(2);
    expect(res.body.folderData[0].desc).toBe(awaitingTask[0].desc);
    expect(res.body.folderData[0]._id).not.toBeNull();
    expect(res.body.folderData[1].desc).toBe(awaitingTask[1].desc);
    expect(res.body.folderData[1]._id).not.toBeNull();
  });

  it("should get the projects inside base folders", async () => {
    const res = await request(server)
      .post(`${url}/folders/project`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folderData).toHaveLength(1);
    expect(res.body.folderData[0].name).toBe(projects[1].name);
    expect(res.body.folderData[0]._id).not.toBeNull();
    expect(res.body.folderData[0].modules).toBe(1);
    expect(res.body.folderData[0].tasks).toBe(1);
  });

  it("should get the project data", async () => {
    const projectFormData = {
      folderId: project._id,
    };
    const res = await request(server)
      .post(`${url}/folders/project/${projects[1].name}`)
      .set("x-auth-token", token)
      .send(projectFormData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folderData).toHaveLength(2);
    expect(res.body.folderData[0].total).toBe(1);
    expect(res.body.folderData[1].total).toBe(1);
  });

  it("should get the module data", async () => {
    const moduleFormData = {
      folderId: module._id,
    };
    const res = await request(server)
      .post(`${url}/folders/module/${projects[1].modules[0].name}`)
      .set("x-auth-token", token)
      .send(moduleFormData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folderData).toHaveLength(1);
    expect(res.body.folderData[0].task).not.toBeNull();
    expect(res.body.folderData[0]._id).not.toBeNull();
    expect(res.body.folderData[0].task._id).not.toBeNull();
  });

  it("should get the project tasks data (All Task folder)", async () => {
    const projectFormData = {
      folderId: project._id,
    };
    const res = await request(server)
      .post(`${url}/folders/project/project-task`)
      .set("x-auth-token", token)
      .send(projectFormData);
    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
    expect(res.body.folderData).toHaveLength(1);
    expect(res.body.folderData[0]._id).not.toBeNull();
    expect(res.body.folderData[0].task).not.toBeNull();
    expect(res.body.folderData[0].task._id).not.toBeNull();
  });
});
