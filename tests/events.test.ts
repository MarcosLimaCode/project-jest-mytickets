import app from "../src/index";
import supertest from "supertest";

const api = supertest(app);

describe("GET /event", () => {
  it("should return status 200", async () => {
    const { status } = await api.get("/events");
    expect(status).toBe(200);
  });
});
