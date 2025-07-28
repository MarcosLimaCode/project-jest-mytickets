import { faker } from "@faker-js/faker";
import prisma from "database";

export async function postEvent() {
  return {
    name: faker.lorem.words(2),
    date: faker.date.future(),
  };
}

export async function postInvalidEvent(name: string) {
  return {
    name: name,
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

export async function createInvalidEvent() {
  return await prisma.event.create({
    data: {
      name: faker.lorem.words(2),
      date: faker.date.past(),
    },
  });
}
