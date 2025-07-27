import prisma from "database";
import app from "../src/index";
import supertest from "supertest";
import { faker } from "@faker-js/faker";

const api = supertest(app);

beforeEach(async () => {
  await prisma.event.deleteMany();
});

describe("POST /event", () => {
  it("should a create event", async () => {
    //a1
    const { status } = await api.post("/events").send({
      name: faker.lorem.words(2),
      date: faker.date.future(),
    });

    //a2
    const { body } = await api.get("/events");

    //a3

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
    //a1

    await prisma.event.create({
      data: {
        name: faker.lorem.words(2),
        date: faker.date.future(),
      },
    });

    await prisma.event.create({
      data: {
        name: faker.lorem.words(2),
        date: faker.date.future(),
      },
    });

    await prisma.event.create({
      data: {
        name: faker.lorem.words(2),
        date: faker.date.future(),
      },
    });

    //a2
    const { status, body } = await api.get("/events");

    //a3
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
    const { id } = await prisma.event.create({
      data: {
        name: faker.lorem.words(2),
        date: faker.date.future(),
      },
    });
    const { status, body } = await api.get(`/events/${id}`);
    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: id,
    });
  });
});
