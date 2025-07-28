import prisma from "database";
import app from "../src/index";
import supertest from "supertest";
import { createEvent, createInvalidEvent } from "./factories/events-factory";
import {
  createTicket,
  postTicket,
  postWrongTicket,
} from "./factories/tickets-factory";

const api = supertest(app);

beforeEach(async () => {
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
});

afterAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
});

describe("POST /ticket", () => {
  it("should create a ticket", async () => {
    const { id } = await createEvent();
    const data = await postTicket(id);
    const { status } = await api.post("/tickets").send(data);
    const { body } = await api.get(`/tickets/${id}`);
    expect(status).toBe(201);
    expect(body).toHaveLength(1);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          code: expect.any(String),
          owner: expect.any(String),
          eventId: expect.any(Number),
        }),
      ])
    );
  });

  it("should return error for try to create a ticket for a invalid event", async () => {
    const { id } = await createInvalidEvent();
    const data = await postTicket(id);
    const { status } = await api.post("/tickets").send(data);
    expect(status).toBe(403);
  });
});

describe("GET /ticket", () => {
  it("should return no tickets", async () => {
    const { id } = await createEvent();
    const { body } = await api.get(`/tickets/${id}`);
    expect(body).toEqual([]);
  });

  it("should return all tickets", async () => {
    const { id } = await createEvent();
    const ticket1 = await postTicket(id);
    await api.post(`/tickets`).send(ticket1);
    const ticket2 = await postTicket(id);
    await api.post(`/tickets`).send(ticket2);
    const ticket3 = await postTicket(id);
    await api.post(`/tickets`).send(ticket3);
    const { status, body } = await api.get(`/tickets/${id}`);
    expect(status).toBe(200);
    expect(body).toHaveLength(3);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          code: expect.any(String),
          owner: expect.any(String),
          eventId: expect.any(Number),
        }),
      ])
    );
  });

  it("should return error at wrong format", async () => {
    const data = await postWrongTicket();
    const { status } = await api.post("/tickets").send(data);
    expect(status).toBe(422);
  });

  it("should return error at duplicate event", async () => {
    const { id } = await createEvent();
    const data = await postTicket(id);
    await api.post("/tickets").send(data);

    const { status } = await api.post("/tickets").send(data);
    expect(status).toBe(409);
  });
});

describe("PUT /ticket", () => {
  it("should change the ticket status to used", async () => {
    const result = await createEvent();
    const { id } = await createTicket(result.id);
    const { status } = await api.put(`/tickets/use/${id}`);
    expect(status).toBe(204);
  });
  it("should return error at invalid id", async () => {
    const { status } = await api.put("/tickets/use/9999n");
    expect(status).toBe(400);
  });
  it("should return error at ticket already used", async () => {
    const result = await createEvent();
    const { id } = await createTicket(result.id);
    await api.put(`/tickets/use/${id}`);
    const { status } = await api.put(`/tickets/use/${id}`);
    expect(status).toBe(403);
  });
});
