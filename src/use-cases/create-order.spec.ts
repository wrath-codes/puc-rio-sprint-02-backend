import { beforeEach, describe, expect, it } from "vitest";

import { ClientNotFoundError } from "./errors/client-not-found";
import { CreateOrderUseCase } from "./create-order";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";

let clientsRepository: InMemoryClientsRepository;
let ordersRepository: InMemoryOrdersRepository;
let sut: CreateOrderUseCase;

describe("Create Order Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    ordersRepository = new InMemoryOrdersRepository();
    sut = new CreateOrderUseCase(clientsRepository, ordersRepository);
  })

  it("should be able to create a new order", async () => {
    const newClient = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const { order } = await sut.execute({
      client_id: newClient.id,
      delivery: true,
      note: "Example Note",
    });

    expect(order.id).toEqual(expect.any(String));
  })

  it("should not be able to create a new order with a non-existing client", async () => {
    await expect(sut.execute({
      client_id: "non-existing-client-id",
      delivery: true,
      note: "Example Note",
    })).rejects.toBeInstanceOf(ClientNotFoundError);
  })
})