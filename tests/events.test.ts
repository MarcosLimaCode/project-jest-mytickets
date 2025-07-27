import prisma from "database";
import app from "../src/index";
import supertest from "supertest";
import {
  createEvent,
  postEvent,
  postWrongEvent,
} from "./factories/events-factory";

const api = supertest(app);

beforeEach(async () => {
  await prisma.event.deleteMany();
});

describe("POST /event", () => {
  it("should a create event", async () => {
    const data = await postEvent();
    const { status } = await api.post("/events").send(data);
    const { body } = await api.get("/events");
    expect(status).toBe(201);
    expect(body).toHaveLength(1);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          date: expect.any(String),
        }),
      ])
    );
  });
});

describe("GET /event", () => {
  it("should return no events", async () => {
    const { body } = await api.get("/events");
    expect(body).toEqual([]);
  });

  it("should return all events", async () => {
    await createEvent();
    await createEvent();
    await createEvent();
    const { status, body } = await api.get("/events");
    expect(status).toBe(200);
    expect(body).toHaveLength(3);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          date: expect.any(String),
        }),
      ])
    );
  });

  it("should return especific event by id", async () => {
    const { id } = await createEvent();
    const { status, body } = await api.get(`/events/${id}`);
    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: id,
    });
  });

  it("should return error at wrong id", async () => {
    const { status } = await api.get("/events/9999");
    expect(status).toBe(404);
  });

  it("should return error at invalid id", async () => {
    const { status } = await api.get("/events/9999n");
    expect(status).toBe(400);
  });

  it("should return error at wrong format", async () => {
    const data = await postWrongEvent();
    const { status } = await api.post("/events").send(data);
    expect(status).toBe(422);
  });

  it("should return error at duplicate event", async () => {
    const data = await postEvent();
    await api.post("/events").send(data);
    const { status } = await api.post("/events").send(data);
    expect(status).toBe(409);
  });
});

describe("PUT /event", () => {
  it("should change a event", async () => {
    const { id } = await createEvent();
    const data = await postEvent();
    const { status } = await api.put(`/events/${id}`).send(data);
    const { body } = await api.get(`/events/${id}`);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        date: expect.any(String),
      })
    );
  });
});

describe("DELETE /event", () => {
  it("should delete a event", async () => {
    const { id } = await createEvent();

    const { status } = await api.delete(`/events/${id}`);
    const result = await api.get(`/events/${id}`);
    expect(status).toBe(204);
    expect(result).toEqual(expect.arrayContaining([]));
  });
});
