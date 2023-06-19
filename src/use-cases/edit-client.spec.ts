import { beforeEach, describe, expect, it } from "vitest";

import { ClientNotFoundError } from "./errors/client-not-found";
import { EditClientUseCase } from "./edit-client";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";

let clientsRepository: InMemoryClientsRepository;
let sut: EditClientUseCase;

describe("Edit Client Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new EditClientUseCase(clientsRepository);
  });

  it("should be able to edit an existing client", async () => {
    const newClient = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const { client } = await sut.execute({
      id: newClient.id,
      client: {
        name: "Jane",
        last_name: "Da Silva",
        email: "janedasilva@example.com",
        phone: "21987654322",
      },
    });

    expect(client.name).toEqual("Jane");
    expect(client.last_name).toEqual("Da Silva");
    expect(client.email).toEqual("janedasilva@example.com");
    expect(client.phone).toEqual("21987654322");
  });

  it("should not be able to edit a non-existing client", async () => {
    await expect(sut.execute({
      id: "non-existing-client-id",
      client: {
        name: "Jane",
        last_name: "Da Silva",
        email: "janedasilva@example.com",
        phone: "21987654322",
      },
    })).rejects.toBeInstanceOf(ClientNotFoundError);
  });
});


