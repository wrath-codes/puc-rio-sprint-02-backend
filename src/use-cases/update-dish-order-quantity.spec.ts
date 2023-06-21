import { beforeEach, describe, expect, it } from "vitest";

import { DishNotFoundError } from "./errors/dish-not-found";
import { DishOrderNotFoundError } from "./errors/dish-order-not-found";
import { DishOrdersRepositoryInMemory } from "@/repositories/in-memory/dish-orders-repository-in-memory";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";
import { OrderNotFoundError } from "./errors/order-not-found";
import { UpdateDishOrderQuantityUseCase } from "./update-dish-order-quantity";

let dishesRepository: InMemoryDishesRepository;
let ordersRepository: InMemoryOrdersRepository;
let dishOrdersRepository: DishOrdersRepositoryInMemory;
let sut: UpdateDishOrderQuantityUseCase;

describe("Update Dish Order Quantity Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    ordersRepository = new InMemoryOrdersRepository();
    dishOrdersRepository = new DishOrdersRepositoryInMemory();
    sut = new UpdateDishOrderQuantityUseCase(dishesRepository, ordersRepository, dishOrdersRepository);
  })

  it("should be able to update a dish order quantity", async () => {
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
      quantity: 2,
    });

    const updatedOrder = await ordersRepository.findById(order.id);

    expect(updatedOrder!.total).toBe(2);
  });

  it("should not be able to update a dish order quantity if order does not exist", async () => {
    const dish = await dishesRepository.create({
      menu_id: "menu_id",
      title: "Example Dish",
      description: "Example Description",
      kind: "MEAT",
    });

    await expect(sut.execute({
      order_id: "order_id",
      dish_id: dish.id,
      quantity: 1,
    })).rejects.toBeInstanceOf(OrderNotFoundError);
  })

  it("should not be able to update a dish order quantity if dish does not exist", async () => {
    const order = await ordersRepository.create({
      client_id: "client_id",
      delivery: true,
      note: "Example Note",
      total: 0,
    });

    await expect(sut.execute({
      order_id: order.id,
      dish_id: "dish_id",
      quantity: 1,
    })).rejects.toBeInstanceOf(DishNotFoundError);
  })

  it("should not be able to update a dish order quantity if dish order does not exist", async () => {
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

    await dishOrdersRepository.delete(dishOrder.id);

    await ordersRepository.subtractTotal(order.id, dishOrder.quantity);


    await expect(sut.execute({
      order_id: order.id,
      dish_id: dish.id,
      quantity: 1,
    })).rejects.toBeInstanceOf(DishOrderNotFoundError);
  })
});