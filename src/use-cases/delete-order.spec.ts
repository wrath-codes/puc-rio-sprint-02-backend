import { beforeEach, describe, expect, it } from "vitest";

import { DeleteOrderUseCase } from "./delete-order";
import { DishOrdersRepositoryInMemory } from "@/repositories/in-memory/dish-orders-repository-in-memory";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";
import { OrderNotFoundError } from "./errors/order-not-found";

let dishOrdersRepository: DishOrdersRepositoryInMemory;
let ordersRepository: InMemoryOrdersRepository;
let clientsRepository: InMemoryClientsRepository;
let sut: DeleteOrderUseCase;

describe("Delete Order Use Case", () => {
  beforeEach(() => {
    dishOrdersRepository = new DishOrdersRepositoryInMemory();
    ordersRepository = new InMemoryOrdersRepository();
    clientsRepository = new InMemoryClientsRepository();

    sut = new DeleteOrderUseCase(dishOrdersRepository, ordersRepository);
  })

  it("should be able to delete an order", async () => {
    const newClient = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const order = await ordersRepository.create({
      client_id: newClient.id,
      delivery: true,
      note: "Example Note",
      total: 0,
    });

    await dishOrdersRepository.create({
      order_id: order.id,
      dish_id: "dish_id",
      quantity: 1,
    });

    const { order: deletedOrder } = await sut.execute({
      order_id: order.id,
    });

    expect(deletedOrder.id).toEqual(order.id);
  })

  it("should not be able to delete an order that does not exist", async () => {
    await expect(sut.execute({
      order_id: "non-existing-order-id",
    })).rejects.toBeInstanceOf(OrderNotFoundError);
  })
})