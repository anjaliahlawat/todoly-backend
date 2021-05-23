// eslint-disable-next-line import/no-extraneous-dependencies
import * as request from "supertest";

import server from "../../../src/index";

describe("/api/auth", () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {});
  afterEach(() => {
    server.close();
  });

  it("should save capture task in database", async () => {
    const formData = {
      email: "anjali@gmail.com",
      tasks: [
        {
          type: "text",
          desc: "Create PLM app",
        },
      ],
    };

    const res = await request(server)
      .post("/api/capture-task/add")
      .send(formData);
    expect(res.status).toBe(200);
  });
});
