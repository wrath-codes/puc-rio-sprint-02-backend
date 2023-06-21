import { beforeEach, describe, expect, it } from "vitest";

import { AddDishOrderUseCase } from "./add-dish-order";
import { DishNotFoundError } from "./errors/dish-not-found";
import { DishOrderAlreadyExistsError } from "./errors/dish-order-already-exists";
import { DishOrdersRepositoryInMemory } from "@/repositories/in-memory/dish-orders-repository-in-memory";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";
import { OrderNotFoundError } from "./errors/order-not-found";

let dishesRepository: InMemoryDishesRepository;
let ordersRepository: InMemoryOrdersRepository;
let dishOrdersRepository: DishOrdersRepositoryInMemory;
let sut: AddDishOrderUseCase;

describe("Add Dish Order Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    ordersRepository = new InMemoryOrdersRepository();
    dishOrdersRepository = new DishOrdersRepositoryInMemory();
    sut = new AddDishOrderUseCase(dishesRepository, ordersRepository, dishOrdersRepository);
  });

  it("should be able to add a dish order", async () => {

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

    const { dishOrder } = await sut.execute({
      order_id: order.id,
      dish_id: dish.id,
      quantity: 1,
    });

    expect(dishOrder.id).toEqual(expect.any(String));
  });

  it("should not be able to add a dish order to an order that does not exist", async () => {
    const dish = await dishesRepository.create({
      menu_id: "menu_id",
      title: "Example Dish",
      description: "Example Description",
      kind: "MEAT",
    });

    await expect(sut.execute({
      order_id: "non-existing-order",
      dish_id: dish.id,
      quantity: 1,
    })).rejects.toBeInstanceOf(OrderNotFoundError);
  })

  it("should not be able to add a dish order to an order with a dish that does not exist", async () => {
    const order = await ordersRepository.create({
      client_id: "client_id",
      delivery: true,
      note: "Example Note",
      total: 0,
    });

    await expect(sut.execute({
      order_id: order.id,
      dish_id: "non-existing-dish",
      quantity: 1,
    })).rejects.toBeInstanceOf(DishNotFoundError);
  })

  it("should not be able to add a dish order to an order that already has the dish", async () => {
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

    await dishOrdersRepository.create({
      order_id: order.id,
      dish_id: dish.id,
      quantity: 1,
    });

    await expect(sut.execute({
      order_id: order.id,
      dish_id: dish.id,
      quantity: 1,
    })).rejects.toBeInstanceOf(DishOrderAlreadyExistsError);
  })

});
