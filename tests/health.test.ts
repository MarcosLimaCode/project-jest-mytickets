import app from "../src/index";
import supertest from "supertest";

const api = supertest(app);

describe("GET /health", () => {
  it("should return status 200 and a message", async () => {
    const { status, text } = await api.get("/health");
    expect(status).toBe(200);
    expect(text).toBe(`I'm okay!`);
  });
});
