import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";
import { ListClientsUseCase } from "./list-clients";

let clientsRepository: InMemoryClientsRepository;
let sut: ListClientsUseCase;

describe("List Clients Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new ListClientsUseCase(clientsRepository);
  })

  it("should be able to list all clients", async () => {
    const client_01 = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const client_02 = await clientsRepository.create({
      name: "Jane",
      last_name: "Doe",
      email: "janedoe@email.com",
      phone: "21987654321",
    });

    const { clients } = await sut.execute();

    expect(clients).toHaveLength(2);
    expect(clients).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: client_01.id,
      }),
      expect.objectContaining({
        id: client_02.id,
      }),
    ]));
  });
});