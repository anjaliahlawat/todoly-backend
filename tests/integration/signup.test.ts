// eslint-disable-next-line import/no-extraneous-dependencies
import * as request from "supertest";

import server from "../../src/index";
import { User } from "../../src/modals/users";

describe("/api/register", () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {});
  afterEach(async () => {
    server.close();
    // await User.remove({});
  });

  it("should register new user on valid credentials", async () => {
    const formData = {
      username: "Anjali Ahlawat",
      phoneNumber: "9654081639",
      email: "anjali@gmail.com",
      password: "87654321",
    };

    const res = await request(server).post("/api/register").send(formData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user.username", formData.username);
  });

  it("should return error if email id is already registered", async () => {
    const formData = {
      username: "Ankur Satya",
      phoneNumber: "9891972726",
      email: "anjali@gmail.com",
      password: "87654321",
    };

    const res = await request(server).post("/api/register").send(formData);
    expect(res.status).toBe(400);
    expect(res.text).toBe("User already registered");
  });
});
