import { beforeEach, describe, expect, it } from "vitest";

import { ClienWithNoAddressError } from "./errors/client-with-no-address";
import { ClientNotFoundError } from "./errors/client-not-found";
import { GetClientInfoUseCase } from "./get-client-info";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/addresses-repository-in-memory";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";

let clientsRepository: InMemoryClientsRepository;
let addressesRepository: InMemoryAddressesRepository;
let sut: GetClientInfoUseCase;

describe("Get Client Info Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    addressesRepository = new InMemoryAddressesRepository();
    sut = new GetClientInfoUseCase(clientsRepository, addressesRepository);
  })

  it("should be able to get client info", async () => {
    const client = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const address = await addressesRepository.create({
      client_id: client.id,
      street: "Street",
      number: "123",
      complement: "Complement",
      district: "District",
      city: "City",
      zipcode: "Zip Code",
    });

    const { client: clientInfo, address: addressInfo } = await sut.execute({
      id: client.id,
    });

    expect(clientInfo).toEqual(client);
    expect(addressInfo).toEqual(address);
  });

  it("should not be able to get client info if client does not exists", async () => {
    await expect(sut.execute({
      id: "non-existing-id",
    })).rejects.toBeInstanceOf(ClientNotFoundError);
  })

  it("should not be able to get client info if client does not have an address", async () => {
    const client = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    await expect(sut.execute({
      id: client.id,
    })).rejects.toBeInstanceOf(ClienWithNoAddressError);
  })
});