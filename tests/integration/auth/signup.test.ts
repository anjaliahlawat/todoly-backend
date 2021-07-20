import * as dotenv from "dotenv";
import * as request from "supertest";

import * as assets from "../../../assets/qa.json";
import server from "../../../src/index";

dotenv.config();

describe("/api/register", () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {});
  afterEach(() => {
    server.close();
    // await User.remove({});
  });

  const { users } = assets;
  const { password } = process.env;

  it("should register new user on valid credentials", async () => {
    const formData = {
      username: users.username,
      phoneNumber: users.phoneNumber,
      email: users.email,
      password,
    };

    const res = await request(server).post("/api/register").send(formData);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user.username", formData.username);
  });

  it("should return error if email id is already registered", async () => {
    const formData = {
      username: "Ankur Satya",
      phoneNumber: "9891972726",
      email: users.email,
      password,
    };

    const res = await request(server).post("/api/register").send(formData);
    expect(res.status).toBe(400);
    expect(res.text).toBe("User already registered");
  });
});
