import { beforeEach, describe, expect, it } from "vitest";

import { ClientNotFoundError } from "./errors/client-not-found";
import { DeleteClientUseCase } from "./delete-client";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";

let clientsRepository: InMemoryClientsRepository;
let sut: DeleteClientUseCase;

describe("Delete Client Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    sut = new DeleteClientUseCase(clientsRepository);
  });

  it("should be able to delete an existing client", async () => {
    const newClient = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    await sut.execute({
      id: newClient.id,
    });

    await expect(clientsRepository.findById(newClient.id)).resolves.toBeNull();


  });

  it("should not be able to delete a non-existing client", async () => {
    await expect(sut.execute({
      id: "non-existing-client-id",
    })).rejects.toBeInstanceOf(ClientNotFoundError);
  })
});