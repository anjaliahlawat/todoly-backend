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

describe("Organize task Api / Delete", () => {
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
      ids: ["6076d133ac403961231bcba5"],
    };

    const res = await request(server)
      .post(`${url}/folder/delete`)
      .send(formData);
    expect(res.status).toBe(401);
  });

  it("should return 404 if invalid id is provided", async () => {
    formData.folderData = {
      ids: ["ihfrebrbfhoreodde"],
    };

    const res = await request(server)
      .post(`${url}/folder/delete`)
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(404);
  });

  describe("delete simple tasks", () => {
    let task1;
    let task2;
    let orgTask1;
    let orgTask2;

    beforeEach(async () => {
      task1 = new TaskModel({ desc: simpleTask[0], type: "text" });
      task1 = await task1.save();

      task2 = new TaskModel({ desc: simpleTask[1], type: "text" });
      task2 = await task2.save();

      orgTask1 = new OrganizedTaskModel({
        task: task1._id,
        path: "simple-task",
        finishDate: addDaysToCurrentDate(3),
      });
      orgTask1 = await orgTask1.save();

      orgTask2 = new OrganizedTaskModel({
        task: task2._id,
        path: "simple-task",
        finishDate: addDaysToCurrentDate(3),
      });
      orgTask2 = await orgTask2.save();
    });

    it("should delete the simple tasks whose ids are provied", async () => {
      formData.folderData = {
        ids: [orgTask1._id.toString(), orgTask2._id.toString()],
        type: "simple-task",
      };

      const res = await request(server)
        .post(`${url}/folder/delete`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const tasks = await TaskModel.find({
        _id: { $in: [task1._id.toString(), task2._id.toString()] },
      });
      expect(tasks).toEqual([]);

      const orgTasks = await OrganizedTaskModel.find({
        _id: { $in: [orgTask1._id.toString(), orgTask2._id.toString()] },
      });
      expect(orgTasks).toEqual([]);
    });
  });

  describe("delete later tasks", () => {
    let task1;
    let task2;
    let laterTask1;
    let laterTask2;

    beforeEach(async () => {
      task1 = new TaskModel({ desc: laterTask[0], type: "text" });
      task1 = await task1.save();

      task2 = new TaskModel({ desc: laterTask[1], type: "text" });
      task2 = await task2.save();

      laterTask1 = new LaterTasksModel({
        task: task1._id,
      });
      laterTask1 = await laterTask1.save();

      laterTask2 = new LaterTasksModel({
        task: task2._id,
      });
      laterTask2 = await laterTask2.save();
    });

    it("should delete the later tasks whose ids are provied", async () => {
      formData.folderData = {
        ids: [laterTask1.id.toString(), laterTask2.id.toString()],
        type: "later",
      };

      const res = await request(server)
        .post(`${url}/folder/delete`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const tasks = await TaskModel.find({
        _id: { $in: [task1.id.toString(), task2.id.toString()] },
      });
      expect(tasks).toEqual([]);

      const laterTasks = await LaterTasksModel.find({
        _id: { $in: [laterTask1.id.toString(), laterTask2.id.toString()] },
      });
      expect(laterTasks).toEqual([]);
    });
  });

  describe("delete awaiting tasks", () => {
    let task1;
    let task2;
    let awaitingTask1;
    let awaitingTask2;

    beforeEach(async () => {
      task1 = new TaskModel({ desc: awaitingTask[0].desc, type: "text" });
      task1 = await task1.save();

      task2 = new TaskModel({ desc: awaitingTask[1].desc, type: "text" });
      task2 = await task2.save();

      awaitingTask1 = new WaitingListModel({
        task: task1._id,
        reason: awaitingTask[0].reason,
        date: addDaysToCurrentDate(3),
      });
      awaitingTask1 = await awaitingTask1.save();

      awaitingTask2 = new WaitingListModel({
        task: task2._id,
        reason: awaitingTask[1].reason,
        date: addDaysToCurrentDate(3),
      });
      awaitingTask2 = await awaitingTask2.save();
    });

    it("should delete the awaiting tasks whose ids are provied", async () => {
      formData.folderData = {
        ids: [awaitingTask1._id.toString(), awaitingTask2._id.toString()],
        type: "waiting",
      };

      const res = await request(server)
        .post(`${url}/folder/delete`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const tasks = await TaskModel.find({
        _id: { $in: [task1._id.toString(), task2._id.toString()] },
      });
      expect(tasks).toEqual([]);

      const awaitingTasks = await WaitingListModel.find({
        _id: {
          $in: [awaitingTask1._id.toString(), awaitingTask2._id.toString()],
        },
      });
      expect(awaitingTasks).toEqual([]);
    });
  });

  describe("delete project related data", () => {
    let task1;
    let task2;
    let projectOrgTask;
    let moduleOrgTask;
    let projectTask;
    let moduleTask;
    let project;
    let module;

    beforeEach(async () => {
      task1 = new TaskModel({ desc: projects[1].tasks[0].desc, type: "text" });
      task1 = await task1.save();

      task2 = new TaskModel({
        desc: projects[1].modules[0].tasks[0].desc,
        type: "text",
      });
      task2 = await task2.save();

      const projectName = projects[1].name;
      const moduleName = projects[1].modules[0].name;
      const projectPath = `project/${createPath(projectName)}`;
      const modulePath = `project/${createPath(projectName, moduleName)}`;

      project = new ProjectModel({ name: projectName });
      project = await project.save();

      module = new ModuleModel({ name: moduleName, project });
      module = await module.save();

      projectOrgTask = new OrganizedTaskModel({
        task: task1,
        projectPath,
        finishDate: addDaysToCurrentDate(3),
      });
      projectOrgTask = await projectOrgTask.save();

      projectTask = new ProjectTaskModel({
        task: projectOrgTask,
        project,
      });
      await projectTask.save();

      // module task
      moduleOrgTask = new OrganizedTaskModel({
        task: task2,
        modulePath,
        finishDate: addDaysToCurrentDate(3),
      });
      moduleOrgTask = await moduleOrgTask.save();

      moduleTask = new ModuleTaskModel({
        task: moduleOrgTask,
        module,
      });
      await moduleTask.save();
    });

    it("delete project tasks", async () => {
      formData.folderData = {
        ids: [projectTask._id.toString()],
        type: "project-task",
      };

      const res = await request(server)
        .post(`${url}/folder/delete`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const task = await TaskModel.findById(task1._id);
      expect(task).toEqual(null);

      const orgTask = await OrganizedTaskModel.findById(projectOrgTask._id);
      expect(orgTask).toEqual(null);

      const deletedProjectTask = await ProjectTaskModel.findById(
        projectTask._id
      );
      expect(deletedProjectTask).toEqual(null);
    });

    it("delete module tasks", async () => {
      formData.folderData = {
        ids: [moduleTask._id.toString()],
        type: "module-task",
      };

      const res = await request(server)
        .post(`${url}/folder/delete`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const task = await TaskModel.findById(task2._id);
      expect(task).toEqual(null);

      const orgTask = await OrganizedTaskModel.findById(moduleOrgTask._id);
      expect(orgTask).toEqual(null);

      const deletedModuleTask = await ModuleTaskModel.findById(moduleTask._id);
      expect(deletedModuleTask).toEqual(null);
    });

    it("delete modules", async () => {
      formData.folderData = {
        ids: [module._id.toString()],
        type: "module",
      };

      const res = await request(server)
        .post(`${url}/folder/delete`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const deletedModule = await ModuleModel.findById(module._id);
      expect(deletedModule).toEqual(null);

      const moduleTasks = await ModuleTaskModel.find({
        module: module._id,
      });
      expect(moduleTasks).toEqual([]);

      const task = await TaskModel.findById(task2._id);
      expect(task).toEqual(null);

      const orgTask = await OrganizedTaskModel.findById(moduleOrgTask._id);
      expect(orgTask).toEqual(null);
    });

    it("delete projects", async () => {
      formData.folderData = {
        ids: [project._id.toString()],
        type: "project",
      };

      const res = await request(server)
        .post(`${url}/folder/delete`)
        .set("x-auth-token", token)
        .send(formData);
      expect(res.status).toBe(200);

      const deletedProject = await ProjectModel.findById(project._id);
      expect(deletedProject).toEqual(null);

      const deletedModules = await ModuleModel.find({ project: project._id });
      expect(deletedModules).toEqual([]);

      const moduleTasks = await ModuleTaskModel.find({
        module: module._id,
      });
      expect(moduleTasks).toEqual([]);

      const deletedTask2 = await TaskModel.findById(task2._id);
      expect(deletedTask2).toEqual(null);

      const deletedOrgTask2 = await OrganizedTaskModel.findById(
        moduleOrgTask._id
      );
      expect(deletedOrgTask2).toEqual(null);

      const projectTasks = await ProjectTaskModel.find({
        project: project._id,
      });
      expect(projectTasks).toEqual([]);

      const deletedTask = await TaskModel.findById(task1._id);
      expect(deletedTask).toEqual(null);

      const deletedOrgTask = await OrganizedTaskModel.findById(
        projectOrgTask._id
      );
      expect(deletedOrgTask).toEqual(null);
    });
  });
});
