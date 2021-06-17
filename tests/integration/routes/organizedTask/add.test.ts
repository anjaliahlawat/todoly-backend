import * as request from "supertest";

import * as assets from "../../../../assets/qa.json";
import { addDaysToCurrentDate } from "../../../../src/util/dateFuncs";
import { CapturedTaskModel } from "../../../../src/models/captured";
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

describe("Organize task Api / Add", () => {
  let token: string;
  let capturedTaskId: string;
  let taskId: string;

  const url = "/api/organize";
  const { captureTask, project, projectPath } = assets;

  let formData = {
    email: "anjali@gmail.com",
    from: "captured",
    to: "simple-tasks",
    task: {},
  };

  const formCapturedTask = {
    email: "anjali@gmail.com",
    tasks: [
      {
        type: captureTask[3].type,
        desc: captureTask[3].desc,
      },
    ],
  };

  beforeEach(async () => {
    token = new UserModel().getAuthToken();

    await request(server)
      .post("/api/capture-task/add")
      .set("x-auth-token", token)
      .send(formCapturedTask);

    taskId = (await TaskModel.find({ desc: captureTask[3].desc }))[0]._id;
    capturedTaskId = (
      await CapturedTaskModel.find({
        task: taskId,
      })
    )[0]._id;
  });

  afterEach(async () => {
    server.close();
    await TaskModel.remove({});
    await CapturedTaskModel.remove({});
    await LaterTasksModel.remove({});
    await ModuleModel.remove({});
    await ModuleTaskModel.remove({});
    await OrganizedTaskModel.remove({});
    await ProjectModel.remove({});
    await ProjectTaskModel.remove({});
    await WaitingListModel.remove({});
  });

  it("should return 401 if user is not logged in", async () => {
    formData.task = {
      _id: "6076d133ac403961231bcba5",
    };

    const res = await request(server).post(`${url}/add`).send(formData);
    expect(res.status).toBe(401);
  });

  it("should return 404 if task id is invalid", async () => {
    formData.task = {
      _id: "747kjhdlhfblr8734743",
      finishDate: "Thu Apr 21 2021 20:16:33 GMT+0530 (India Standard Time)",
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(404);
  });

  it("should return 400 if finish date is empty/invalid", async () => {
    formData.task = {
      _id: capturedTaskId,
      finishDate: "Thu Apr 21 2021 20:16:33 GMT+0530 (India Standard Time)",
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(400);
  });

  // for adding to simple task
  it("should add organize task to simple-task", async () => {
    formData.task = {
      _id: capturedTaskId,
      finishDate: addDaysToCurrentDate(3),
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);

    const savedTask = await OrganizedTaskModel.find({ task: capturedTaskId });
    expect(savedTask).not.toEqual([]);

    const capturedTask = await CapturedTaskModel.findById(capturedTaskId);
    expect(capturedTask).toBeNull();
  });

  // for adding to later task
  it("should add task to later", async () => {
    formData = {
      ...formData,
      to: "later",
      task: {
        ...formData.task,
        _id: capturedTaskId,
      },
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);

    const savedTask = await LaterTasksModel.find({ task: capturedTaskId });
    expect(savedTask).not.toEqual([]);

    const capturedTask = await CapturedTaskModel.findById(capturedTaskId);
    expect(capturedTask).toBeNull();
  });

  // for adding to awaiting task
  it("should return 400 if reason is empty/invalid", async () => {
    formData = {
      ...formData,
      to: "awaiting",
      task: {
        ...formData.task,
        _id: capturedTaskId,
        reason: "",
      },
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(400);
  });

  it("should return 400 if date is empty/invalid", async () => {
    formData = {
      ...formData,
      to: "awaiting",
      task: {
        ...formData.task,
        _id: capturedTaskId,
        reason: "Waiting for someone to conclude",
        finishDate: "Thu Apr 21 2021 20:16:33 GMT+0530 (India Standard Time)",
      },
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(400);
  });

  it("should add task to awaiting", async () => {
    formData = {
      ...formData,
      to: "awaiting",
      task: {
        ...formData.task,
        _id: capturedTaskId,
        reason: "Waiting for someone to conclude",
        finishDate: addDaysToCurrentDate(3),
      },
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);

    const savedTask = await WaitingListModel.find({ task: capturedTaskId });
    expect(savedTask).not.toEqual([]);

    const capturedTask = await CapturedTaskModel.findById(capturedTaskId);
    expect(capturedTask).toBeNull();
  });

  // for adding to project
  it("should return 400 if project name is not provided", async () => {
    formData = {
      ...formData,
      to: "project",
      task: {
        ...formData.task,
        _id: capturedTaskId,
        project: {
          name: "",
          tasks: [],
          modules: [],
        },
      },
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(400);
  });

  it("should create new project if it doesn't exist & then add task in project", async () => {
    formData = {
      ...formData,
      to: projectPath,
      task: {
        ...formData.task,
        _id: capturedTaskId,
        project: {
          ...project[0],
          tasks: [
            {
              ...project[0].tasks[0],
              finishDate: addDaysToCurrentDate(3),
            },
          ],
        },
      },
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);

    const savedProject = await ProjectModel.find({
      name: project[0].name,
    });
    expect(savedProject).not.toEqual([]);

    const savedOrgTask = await OrganizedTaskModel.find({
      path: formData.to,
    });
    expect(savedOrgTask).not.toEqual([]);

    // new reference of task should be saved once project is created & task is saved
    const savedTask = await TaskModel.findById(savedOrgTask[0].task);
    expect(savedTask).not.toBeNull();

    // task reference & project reference must be saved in project-task model
    const projectTask = await ProjectTaskModel.find({
      task: savedOrgTask[0]._id,
    });
    expect(projectTask).not.toEqual([]);

    const capturedTask = await CapturedTaskModel.findById(capturedTaskId);
    expect(capturedTask).toBeNull();

    // old reference of task saved in task model must be deleted as new reference
    // is created on creating project
    const oldTask = await TaskModel.findById(taskId);
    expect(oldTask).toBeNull();
  });

  it("should create new project & new module & then add task in module", async () => {
    formData = {
      ...formData,
      to: "project",
      task: {
        ...formData.task,
        _id: capturedTaskId,
        project: {
          ...project[1],
          modules: [
            {
              ...project[1].modules[0],
              tasks: [
                {
                  ...project[1].modules[0].tasks[0],
                  finishDate: addDaysToCurrentDate(3),
                },
              ],
            },
          ],
        },
      },
    };

    const res = await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);

    const savedProject = await ProjectModel.find({
      name: project[1].name,
    });
    expect(savedProject).not.toEqual([]);

    const savedModule = await ModuleModel.find({
      name: project[1].modules[0].name,
    });
    expect(savedModule).not.toEqual([]);

    const savedModuleTask = await ModuleTaskModel.find({
      module: savedModule[0]._id,
    });
    expect(savedModuleTask).not.toEqual([]);

    const savedOrgTask = await OrganizedTaskModel.find({
      path: project[1].modules[0].path,
    });
    expect(savedOrgTask).not.toEqual([]);

    // new reference of task should be saved once project is created & task is saved
    const savedTask = await TaskModel.findById(savedOrgTask[0].task);
    expect(savedTask).not.toBeNull();

    const capturedTask = await CapturedTaskModel.findById(capturedTaskId);
    expect(capturedTask).toBeNull();

    // old reference of task saved in task model must be deleted as new reference
    // is created on creating project
    const oldTask = await TaskModel.findById(taskId);
    expect(oldTask).toBeNull();
  });
});
