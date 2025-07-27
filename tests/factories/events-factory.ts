import { faker } from "@faker-js/faker";
import app from "../../src/index";
import supertest from "supertest";
import prisma from "database";

const api = supertest(app);

export async function postEvent() {
  return {
    name: faker.lorem.words(2),
    date: faker.date.future(),
  };
}

export async function postWrongEvent() {
  return {
    name: faker.number.int(),
    date: faker.date.future(),
  };
}

export async function createEvent() {
  return await prisma.event.create({
    data: {
      name: faker.lorem.words(2),
      date: faker.date.future(),
    },
  });
}
