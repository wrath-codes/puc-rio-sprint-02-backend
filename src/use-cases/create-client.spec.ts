import { beforeEach, describe, expect, it } from "vitest";

import { ClientAlreadyExistsError } from "./errors/client-already-exists";
import { CreateClientUseCase } from "./create-client";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/addresses-repository-in-memory";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";

let clientsRepository: InMemoryClientsRepository;
let addressesRepository: InMemoryAddressesRepository;
let sut: CreateClientUseCase;

describe("Create Client Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    addressesRepository = new InMemoryAddressesRepository();
    sut = new CreateClientUseCase(clientsRepository, addressesRepository);
  });

  it("should be able to create a new client", async () => {
    const { client } = await sut.execute({
      client: {
        name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        phone: "21987654321",
      },
      address: {
        street: "Example Street",
        number: "123",
        complement: "Example Complement",
        district: "Example District",
        city: "Example City",
        zipcode: "24680135",
      },
    });

    expect(client.id).toEqual(expect.any(String));
  })

  it("should not be able to create a new client with an email that is already in use", async () => {
    await sut.execute({
      client: {
        name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        phone: "21987654321",
      },
      address: {
        street: "Example Street",
        number: "123",
        complement: "Example Complement",
        district: "Example District",
        city: "Example City",
        zipcode: "24680135",
      },
    });

    await expect(sut.execute({
      client: {
        name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        phone: "21987654321",
      },
      address: {
        street: "Example Street",
        number: "123",
        complement: "Example Complement",
        district: "Example District",
        city: "Example City",
        zipcode: "24680135",
      },
    })).rejects.toBeInstanceOf(ClientAlreadyExistsError);


  })
})