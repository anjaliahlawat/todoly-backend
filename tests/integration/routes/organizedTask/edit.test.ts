import * as request from "supertest";

import * as assets from "../../../../assets/qa.json";
import { addDaysToCurrentDate } from "../../../../src/util/dateFuncs";
import { CapturedTaskModel } from "../../../../src/models/captured";
import { OrganizedTaskModel } from "../../../../src/models/organizedTask";
import server from "../../../../src/index";
import { TaskModel } from "../../../../src/models/task";
import { UserModel } from "../../../../src/models/users";

const url = "/api/organize";
const { users, captureTask } = assets;

describe("Organize Simple task Api / Edit", () => {
  let token: string;
  let capturedTaskId: string;
  let organizedTaskId: string;

  const formDataSimpleTask = {
    email: users.email,
    from: "captured",
    to: "simple-tasks",
    task: {
      _id: "",
      finishDate: addDaysToCurrentDate(3),
    },
  };

  const formCapturedTask = {
    email: users.email,
    tasks: [
      {
        type: captureTask[3].type,
        desc: captureTask[3].desc,
      },
    ],
  };

  const formDataEditSimpleTask = {
    folderData: {
      _id: "",
      finishDate: "",
      type: "simple-task",
    },
  };

  beforeEach(async () => {
    token = new UserModel().getAuthToken();

    await request(server)
      .post("/api/capture-task/add")
      .set("x-auth-token", token)
      .send(formCapturedTask);

    const task = await TaskModel.find({ desc: captureTask[3].desc });
    capturedTaskId = (
      await CapturedTaskModel.find({
        task: task[0]._id,
      })
    )[0]._id;

    formDataSimpleTask.task._id = capturedTaskId;

    await request(server)
      .post(`${url}/add`)
      .set("x-auth-token", token)
      .send(formDataSimpleTask);

    organizedTaskId = await OrganizedTaskModel.find({ task: capturedTaskId })[0]
      ._id;
  });

  afterEach(async () => {
    server.close();
    await TaskModel.remove({});
    await CapturedTaskModel.remove({});
    await OrganizedTaskModel.remove({});
  });

  it("should return 401 if user is not logged in", async () => {
    formDataEditSimpleTask.folderData._id = organizedTaskId;

    const res = await request(server)
      .post(`${url}/edit`)
      .send(formDataEditSimpleTask);
    expect(res.status).toBe(401);
  });

  it("should return 404 if simple task id is invalid", async () => {
    formDataEditSimpleTask.folderData._id = "747kjhdlhfblr8734743";

    const res = await request(server)
      .post(`${url}/edit`)
      .set("x-auth-token", token)
      .send(formDataEditSimpleTask);
    expect(res.status).toBe(404);
  });

  it("should return 400 if finish date is invalid", async () => {
    formDataEditSimpleTask.folderData.finishDate =
      "Thu Apr 21 2021 20:16:33 GMT+0530 (India Standard Time)";

    const res = await request(server)
      .post(`${url}/edit`)
      .set("x-auth-token", token)
      .send(formDataEditSimpleTask);
    expect(res.status).toBe(400);
  });
});

// it("should edit capture task in database", async () => {

//   const formData = {
//     email: "anjali@gmail.com",
//     tasks: [
//     {
//         type: captureTask[1].type,
//         desc: captureTask[1].desc,
//     },
//     ],
// };
//     const res = await request(server)
//         .post("/api/capture-task/add")
//         .set("x-auth-token", token)
//         .send(formData);
//     expect(res.status).toBe(200);

//     const task = await TaskModel.find({ desc: captureTask[1].desc });
//     expect(task).not.toBeNull();

//     // update the added task
//     const updatedDesc = "Create PLM web application";

//     const formData2 = {
//         task: {
//         _id: task[0]._id,
//         desc: updatedDesc,
//         },
//     };

//     const res2 = await request(server)
//         .post("/api/capture-task/edit")
//         .set("x-auth-token", token)
//         .send(formData2);
//     expect(res2.status).toBe(200);

//     const updatedTask = await TaskModel.find({ desc: updatedDesc });
//     expect(updatedTask).not.toBeNull();
// });
