import { beforeEach, describe, expect, it } from "vitest";

import { DishNotFoundError } from "./errors/dish-not-found";
import { DishOrderNotFoundError } from "./errors/dish-order-not-found";
import { DishOrdersRepositoryInMemory } from "@/repositories/in-memory/dish-orders-repository-in-memory";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";
import { OrderNotFoundError } from "./errors/order-not-found";
import { RemoveDishOrderUseCase } from "./remove-dish-order";

let dishesRepository: InMemoryDishesRepository;
let ordersRepository: InMemoryOrdersRepository;
let dishOrdersRepository: DishOrdersRepositoryInMemory;
let sut: RemoveDishOrderUseCase;

describe("Remove Dish Order Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    ordersRepository = new InMemoryOrdersRepository();
    dishOrdersRepository = new DishOrdersRepositoryInMemory();
    sut = new RemoveDishOrderUseCase(dishesRepository, ordersRepository, dishOrdersRepository);
  })

  it("should be able to remove a dish order", async () => {
    const dish = await dishesRepository.create({
      menu_id: "menu_id",
      title: "Example Dish",
      description: "Example Description",
      kind: "MEAT",
    });

    const order = await ordersRepository.create({
      client_id: "client_id",
      delivery: true,
      note: "Example Note",
      total: 0,
    });

    const dishOrder = await dishOrdersRepository.create({
      order_id: order.id,
      dish_id: dish.id,
      quantity: 1,
    });

    await ordersRepository.addTotal(order.id, dishOrder.quantity);


    await sut.execute({
      order_id: order.id,
      dish_id: dish.id,
    });

    const updatedOrder = await ordersRepository.findById(order.id);
    if (!updatedOrder) throw new OrderNotFoundError();


    expect(updatedOrder.total).toBe(0);
  });
});