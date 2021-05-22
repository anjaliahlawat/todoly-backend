// eslint-disable-next-line import/no-extraneous-dependencies
import * as request from "supertest";

import server from "../../src/index";

describe("/api/auth", () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {});
  afterEach(() => {
    server.close();
  });

  it("should login user on valid credentials", async () => {
    const formData = {
      email: "anjali@gmail.com",
      password: "87654321",
    };

    const res = await request(server).post("/api/auth").send(formData);
    // console.log(res);
    expect(res.status).toBe(200);
    // expect(res.text).
  });

  it("should return error on invalid credentials", async () => {
    const formData = {
      email: "anjali@gmail.com",
      password: "12345678",
    };

    const res = await request(server).post("/api/auth").send(formData);
    // console.log(res);
    expect(res.status).toBe(200);
    // expect(res.text).
  });
});
