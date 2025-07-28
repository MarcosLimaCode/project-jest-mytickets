import { faker } from "@faker-js/faker";
import prisma from "database";

export async function postTicket(id: Number) {
  return {
    code: faker.lorem.words(1),
    owner: faker.person.fullName(),
    eventId: id,
  };
}

export async function postWrongTicket() {
  return {
    name: faker.number.int(),
    date: faker.date.future(),
  };
}

export async function createTicket(id: number) {
  return await prisma.ticket.create({
    data: {
      code: faker.lorem.words(1),
      owner: faker.person.fullName(),
      eventId: id,
    },
  });
}
