import * as request from "supertest";

import * as assets from "../../../assets/qa.json";
import { CapturedTaskModel } from "../../../src/models/captured";
import { TaskModel } from "../../../src/models/task";
import { UserModel } from "../../../src/models/users";
import server from "../../../src/index";

describe("/api/capture-task", () => {
  let token: string;
  beforeEach(() => {
    token = new UserModel().getAuthToken();
  });
  afterEach(async () => {
    server.close();
    await TaskModel.remove({});
    await CapturedTaskModel.remove({});
  });

  const { captureTask } = assets;

  it("should return 401 if user is not logged in", async () => {
    const formData = {
      email: "anjali@gmail.com",
      tasks: [
        {
          type: captureTask[1].type,
          desc: captureTask[1].desc,
        },
      ],
    };

    const res = await request(server)
      .post("/api/capture-task/add")
      .send(formData);
    expect(res.status).toBe(401);
  });

  it("should return 400 if data is invalid", async () => {
    const formData = {
      email: "anjali@gmail.com",
      tasks: [
        {
          type: captureTask[1].type,
          desc: "",
        },
      ],
    };
    const res = await request(server)
      .post("/api/capture-task/add")
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(400);
  });

  it("should save capture task in database", async () => {
    const formData = {
      email: "anjali@gmail.com",
      tasks: [
        {
          type: captureTask[1].type,
          desc: captureTask[1].desc,
        },
      ],
    };

    const res = await request(server)
      .post("/api/capture-task/add")
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);

    const task = await TaskModel.find({ desc: captureTask[1].desc });
    expect(task).not.toBeNull();
    const capturedTask = await CapturedTaskModel.find({ task: task[0]._id });
    expect(capturedTask).not.toBeNull();
  });

  it("should delete capture task in database", async () => {
    // add captured task in db
    const formData = {
      email: "anjali@gmail.com",
      tasks: [
        {
          type: captureTask[1].type,
          desc: captureTask[1].desc,
        },
      ],
    };
    const res = await request(server)
      .post("/api/capture-task/add")
      .set("x-auth-token", token)
      .send(formData);
    expect(res.status).toBe(200);

    const task = await TaskModel.find({ desc: captureTask[1].desc });
    expect(task).not.toBeNull();

    const formData2 = {
      tasks: [
        {
          _id: task[0]._id,
        },
      ],
    };

    const res2 = await request(server)
      .post("/api/capture-task/delete")
      .set("x-auth-token", token)
      .send(formData2);
    expect(res2.status).toBe(200);

    const deletedTask = await TaskModel.findById(task[0]._id);
    expect(deletedTask).toBeNull();
  });
});
