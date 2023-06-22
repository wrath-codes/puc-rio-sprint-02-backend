import { beforeEach, describe, expect, it } from "vitest";

import { DishOrdersRepositoryInMemory } from "@/repositories/in-memory/dish-orders-repository-in-memory";
import { GetOrderPricing } from "./get-order-pricing";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";
import { OrderNotFoundError } from "./errors/order-not-found";
import { truncate } from "fs";

let ordersRepository: InMemoryOrdersRepository;
let menusRepository: InMemoryMenusRepository;
let dishesRepository: InMemoryDishesRepository;
let clientsRepository: InMemoryClientsRepository;
let dishOrdersRepository: DishOrdersRepositoryInMemory;
let sut: GetOrderPricing;

describe("Get Order Pricing Use Case", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    menusRepository = new InMemoryMenusRepository();
    dishesRepository = new InMemoryDishesRepository();
    clientsRepository = new InMemoryClientsRepository();
    dishOrdersRepository = new DishOrdersRepositoryInMemory();
    sut = new GetOrderPricing(ordersRepository);
  });

  it("should be able to get order pricing", async () => {
    const client = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const menu = await menusRepository.create({
    });

    const dish_01 = await dishesRepository.create({
      menu_id: menu.id,
      title: "Dish 1",
      description: "Dish 1 description",
      kind: "MEAT",
    });

    const dish_02 = await dishesRepository.create({
      menu_id: menu.id,
      title: "Dish 2",
      description: "Dish 2 description",
      kind: "VEGETARIAN",
    });

    const order = await ordersRepository.create({
      client_id: client.id,
      delivery: true,
      total: 0,
    });

    await dishOrdersRepository.create({
      order_id: order.id,
      dish_id: dish_01.id,
      quantity: 5,
    });

    await ordersRepository.addTotal(order.id, 5);

    await dishOrdersRepository.create({
      order_id: order.id,
      dish_id: dish_02.id,
      quantity: 2,
    });

    await ordersRepository.addTotal(order.id, 2);

    const orderPricing = await sut.execute({
      order_id: order.id,
      delivery_price: 10,
      item_price: 18,
      combo_price: 80,
    });

    expect(orderPricing).toEqual({
      order_price: 116,
      delivery_price: 10,
      total_price: 126,
    });
  });

  it("should not be able to get order pricing with a non-existing order", async () => {
    await expect(
      sut.execute({
        order_id: "non-existing-order-id",
        delivery_price: 10,
        item_price: 18,
        combo_price: 80,
      })
    ).rejects.toBeInstanceOf(OrderNotFoundError);
  });
});