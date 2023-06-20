import { beforeEach, describe, expect, it } from "vitest";

import { ClienWithNoAddressError } from "./errors/client-with-no-address";
import { ClientNotFoundError } from "./errors/client-not-found";
import { EditAddressUseCase } from "./edit-address";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/addresses-repository-in-memory";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";

let clientsRepository: InMemoryClientsRepository;
let addressesRepository: InMemoryAddressesRepository;
let sut: EditAddressUseCase;

describe("Edit Address Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    addressesRepository = new InMemoryAddressesRepository();
    sut = new EditAddressUseCase(clientsRepository, addressesRepository);
  });

  it("should be able to edit an existing address", async () => {
    const newClient = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const newAddress = await addressesRepository.create({
      client_id: newClient.id,
      street: "Example Street",
      number: "123",
      complement: "Example Complement",
      district: "Example District",
      city: "Example City",
      zipcode: "24680135",
    });

    const { address } = await sut.execute({
      client_id: newClient.id,
      address: {
        street: "Example Street 2",
        number: "321",
        complement: "Example Complement 2",
        district: "Example District 2",
        city: "Example City 2",
        zipcode: "13508642",
      },
    });

    expect(address).toEqual({
      id: newAddress.id,
      client_id: newClient.id,
      street: "Example Street 2",
      number: "321",
      complement: "Example Complement 2",
      district: "Example District 2",
      city: "Example City 2",
      zipcode: "13508642",
    });
  });

  it("should not be able to edit an address from a non-existing client", async () => {
    await expect(
      sut.execute({
        client_id: "non-existing-client-id",
        address: {
          street: "Example Street",
          number: "123",
          complement: "Example Complement",
          district: "Example District",
          city: "Example City",
          zipcode: "24680135",
        },
      })
    ).rejects.toBeInstanceOf(ClientNotFoundError);
  });

  it("should not be able to edit a non-existing address", async () => {
    const newClient = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    await expect(
      sut.execute({
        client_id: newClient.id,
        address: {
          street: "Example Street",
          number: "123",
          complement: "Example Complement",
          district: "Example District",
          city: "Example City",
          zipcode: "24680135",
        },
      })
    ).rejects.toBeInstanceOf(ClienWithNoAddressError);
  });
});
