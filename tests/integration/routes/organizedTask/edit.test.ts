import * as request from "supertest";

import {
  addDaysToCurrentDate,
  subtractDaysFromCurrentDate,
} from "../../../../src/util/dateFuncs";
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
import createPath from "../../../../src/util/helper";

describe("Organize task Api / Edit", () => {
  let token: string;

  const url = "/api/organize";

  const formData = {
    folderData: {},
  };

  beforeEach(async () => {
    token = new UserModel().getAuthToken();
  });

  afterEach(async () => {
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

  it("should return 401 if user is not logged in", async () => {
    formData.folderData = {
      _id: "6076d133ac403961231bcba5",
    };

    const res = await request(server).post(`${url}/folder/edit`).send(formData);
    expect(res.status).toBe(401);
  });

  it("should return 404 if invalid id is provided", async () => {
    formData.folderData = {
      _id: "ihfrebrbfhoreodde",
    };

    const res = await request(server)
      .post(`${url}/folder/edit`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(404);
  });

  describe("edit simple task", () => {
    let task;
    let orgTask;
    const finishDate =
      "Thu June 3 2021 20:16:33 GMT+0530 (India Standard Time)";

    beforeEach(async () => {
      token = new UserModel().getAuthToken();

      const desc = "Complete fees payment for uva";

      task = new TaskModel({
        desc,
        type: "text",
      });
      task = await task.save();

      orgTask = new OrganizedTaskModel({
        task,
        path: "simple-task",
        finishDate: addDaysToCurrentDate(3),
      });
      orgTask = await orgTask.save();
    });

    it("should be able to edit desc", async () => {
      const newDesc = "Pay fees to Uva via transferwise";

      formData.folderData = {
        _id: orgTask._id,
        desc: newDesc,
        type: "simple-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await TaskModel.findById(task._id);
      expect(updatedTask.desc).toEqual(newDesc);
    });

    it("should return 400 if finish date is empty/invalid", async () => {
      formData.folderData = {
        _id: orgTask._id,
        finishDate,
        type: "simple-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(400);
    });

    it("should be able to edit finishDate", async () => {
      const newFinishDate = addDaysToCurrentDate(3);

      formData.folderData = {
        _id: orgTask._id,
        finishDate: newFinishDate,
        type: "simple-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await OrganizedTaskModel.findById(orgTask._id);
      expect(updatedTask.finishDate.getHours()).toEqual(
        newFinishDate.getHours()
      );
    });
  });

  describe("edit later task", () => {
    let task;
    let laterTask;

    beforeEach(async () => {
      token = new UserModel().getAuthToken();
      const desc = "Find out about rent allowance";

      task = new TaskModel({
        desc,
        type: "text",
      });
      task = await task.save();

      laterTask = new LaterTasksModel({ task });
      laterTask = await laterTask.save();
    });

    it("should be able to edit desc", async () => {
      const newDesc = "House allowance blog";

      formData.folderData = {
        _id: laterTask._id,
        desc: newDesc,
        type: "later",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await TaskModel.findById(task._id);
      expect(updatedTask.desc).toEqual(newDesc);
    });
  });

  describe("edit awaiting task", () => {
    let task;
    let awaitingTask;
    const finishDate =
      "Thu June 3 2021 20:16:33 GMT+0530 (India Standard Time)";

    beforeEach(async () => {
      token = new UserModel().getAuthToken();
      const desc = "Book flight tickets";
      const reason = "Waiting for visa approval";

      task = new TaskModel({
        desc,
        type: "text",
      });
      task = await task.save();

      awaitingTask = new WaitingListModel({ task, reason, date: finishDate });
      awaitingTask = await awaitingTask.save();
    });

    it("should be able to edit desc", async () => {
      const newDesc = "Book flight tickets for Amsterdam";

      formData.folderData = {
        _id: awaitingTask._id,
        desc: newDesc,
        type: "waiting",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await TaskModel.findById(task._id);
      expect(updatedTask.desc).toEqual(newDesc);
    });

    it("should be able to edit reason", async () => {
      const newReason = "Waiting for visa approval from IND";

      formData.folderData = {
        _id: awaitingTask._id,
        reason: newReason,
        type: "waiting",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await WaitingListModel.findById(awaitingTask._id);
      expect(updatedTask.reason).toEqual(newReason);
    });

    it("should return 404 for invalid date", async () => {
      formData.folderData = {
        _id: awaitingTask._id,
        finishDate,
        type: "waiting",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(400);
    });

    it("should be able to edit date", async () => {
      const newDate = addDaysToCurrentDate(3);

      formData.folderData = {
        _id: awaitingTask._id,
        finishDate: newDate,
        type: "waiting",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await WaitingListModel.findById(awaitingTask._id);
      expect(updatedTask.date.getHours()).toEqual(newDate.getHours());
    });
  });

  describe("edit project data", () => {
    let module;
    let moduleTask;
    let moduleOrgTask;
    let project;
    let projectTask;
    let projectOrgTask;
    let task1;
    let task2;

    beforeEach(async () => {
      token = new UserModel().getAuthToken();

      const moduleName = "Backend";
      const moduleTaskDesc = "Create login api";
      const projectTaskDesc = "Update names in DB";
      const projectName = "Kimaya app";
      const path = `project/${createPath(projectName, moduleName)}`;

      project = new ProjectModel({ name: projectName });
      project = await project.save();

      module = new ModuleModel({ name: moduleName, project });
      module = await module.save();

      // project task
      task1 = new TaskModel({
        desc: projectTaskDesc,
        type: "text",
      });
      task1 = await task1.save();

      projectOrgTask = new OrganizedTaskModel({
        task: task1,
        path,
        finishDate: addDaysToCurrentDate(3),
      });
      projectOrgTask = await projectOrgTask.save();

      projectTask = new ProjectTaskModel({
        task: projectOrgTask,
        project,
      });
      await projectTask.save();

      // module task
      task2 = new TaskModel({
        desc: moduleTaskDesc,
        type: "text",
      });
      task2 = await task2.save();

      moduleOrgTask = new OrganizedTaskModel({
        task: task2,
        path,
        finishDate: addDaysToCurrentDate(3),
      });
      moduleOrgTask = await moduleOrgTask.save();

      moduleTask = new ModuleTaskModel({
        task: moduleOrgTask,
        module,
      });
      await moduleTask.save();
    });

    it("should edit the name of the project", async () => {
      const newProjectName = "Kimaya school application";

      formData.folderData = {
        _id: project._id,
        name: newProjectName,
        type: "project",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedProject = await ProjectModel.findById(project._id);
      expect(updatedProject.name).toEqual(newProjectName);
    });

    it("should edit the name of the module", async () => {
      const newModuleName = "API end points";

      formData.folderData = {
        _id: module._id,
        name: newModuleName,
        type: "module",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedModule = await ModuleModel.findById(module._id);
      expect(updatedModule.name).toEqual(newModuleName);
    });

    it("should edit desc of the project task", async () => {
      const newProjectTaskDesc = "Update student class in DB";

      formData.folderData = {
        _id: projectTask._id,
        desc: newProjectTaskDesc,
        type: "project-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await TaskModel.findById(task1._id);
      expect(updatedTask.desc).toEqual(newProjectTaskDesc);
    });

    it("should edit desc of the module task", async () => {
      const newModuleTaskDesc = "Create login api end point";

      formData.folderData = {
        _id: moduleTask._id,
        desc: newModuleTaskDesc,
        type: "module-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await TaskModel.findById(task2._id);
      expect(updatedTask.desc).toEqual(newModuleTaskDesc);
    });

    it("should return 400 if finish date of project task is invalid", async () => {
      formData.folderData = {
        _id: projectTask._id,
        finishDate: subtractDaysFromCurrentDate(3),
        type: "project-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(400);
    });

    it("should return 400 if finish date of module task is invalid", async () => {
      formData.folderData = {
        _id: moduleTask._id,
        finishDate: subtractDaysFromCurrentDate(3),
        type: "module-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(400);
    });

    it("should edit finish date of project task", async () => {
      const newFinishDate = addDaysToCurrentDate(3);

      formData.folderData = {
        _id: projectTask._id,
        finishDate: newFinishDate,
        type: "project-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await OrganizedTaskModel.findById(projectOrgTask._id);
      expect(updatedTask.finishDate.getHours()).toEqual(
        newFinishDate.getHours()
      );
    });

    it("should edit finish date of module task", async () => {
      const newFinishDate = addDaysToCurrentDate(3);

      formData.folderData = {
        _id: moduleTask._id,
        finishDate: newFinishDate,
        type: "module-task",
      };

      const res = await request(server)
        .post(`${url}/folder/edit`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const updatedTask = await OrganizedTaskModel.findById(moduleOrgTask._id);
      expect(updatedTask.finishDate.getHours()).toEqual(
        newFinishDate.getHours()
      );
    });
  });
});
