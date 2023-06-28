import { beforeEach, describe, expect, it } from "vitest";

import { DishOrdersRepositoryInMemory } from "@/repositories/in-memory/dish-orders-repository-in-memory";
import { GetOrderMetricsMenu } from "./get-order-metrics-menu";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";
import { MenuNotFoundError } from "./errors/menu-not-found";

let dishesRepository: InMemoryDishesRepository;
let dishOrdersRepository: DishOrdersRepositoryInMemory;
let menuRepository: InMemoryMenusRepository;
let clientsRepository: InMemoryClientsRepository;
let orderRepository: InMemoryOrdersRepository;
let clientRepository: InMemoryClientsRepository;
let sut: GetOrderMetricsMenu;

describe("Get Order Metrics Menu Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    dishOrdersRepository = new DishOrdersRepositoryInMemory();
    menuRepository = new InMemoryMenusRepository();
    orderRepository = new InMemoryOrdersRepository();
    clientsRepository = new InMemoryClientsRepository();

    sut = new GetOrderMetricsMenu(
      dishesRepository,
      dishOrdersRepository,
      menuRepository,
      orderRepository,
      clientsRepository
    );
  });

  it("should be able to get order metrics from a menu", async () => {
    const client_01 = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const client_02 = await clientsRepository.create({
      name: "Jane",
      last_name: "Doe",
      email: "janedoe@example.com",
      phone: "21987654322",
    });

    const menu = await menuRepository.create({
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

    const dish_03 = await dishesRepository.create({
      menu_id: menu.id,
      title: "Dish 3",
      description: "Dish 3 description",
      kind: "CHICKEN",
    });

    const dish_04 = await dishesRepository.create({
      menu_id: menu.id,
      title: "Dish 4",
      description: "Dish 4 description",
      kind: "MEAT",
    });

    const dish_05 = await dishesRepository.create({
      menu_id: menu.id,
      title: "Dish 5",
      description: "Dish 5 description",
      kind: "VEGETARIAN",
    });

    const order_01 = await orderRepository.create({
      client_id: client_01.id,
      delivery: true,
      note: "No onions",
      total: 0,
    });

    const order_02 = await orderRepository.create({
      client_id: client_02.id,
      delivery: true,
      note: "No onions",
      total: 0,
    });

    await dishOrdersRepository.create({
      order_id: order_01.id,
      dish_id: dish_01.id,
      quantity: 2,
    });

    await orderRepository.addTotal(order_01.id, 2);

    await dishOrdersRepository.create({
      order_id: order_01.id,
      dish_id: dish_02.id,
      quantity: 1,
    });

    await orderRepository.addTotal(order_01.id, 1);

    await dishOrdersRepository.create({
      order_id: order_01.id,
      dish_id: dish_03.id,
      quantity: 1,
    });

    await orderRepository.addTotal(order_01.id, 1);

    await dishOrdersRepository.create({
      order_id: order_02.id,
      dish_id: dish_04.id,
      quantity: 2,
    });

    await orderRepository.addTotal(order_02.id, 2);

    await dishOrdersRepository.create({
      order_id: order_02.id,
      dish_id: dish_05.id,
      quantity: 1,
    });

    await orderRepository.addTotal(order_02.id, 1);

    const metrics = await sut.execute({
      menu_id: menu.id,
    })

    expect(metrics.total_orders).toBe(2);
    expect(metrics.total_quantity).toBe(7);
    expect(metrics.orders_by_dish).toEqual([
      expect.objectContaining({
        id: dish_01.id,
        quantity: 2,
      }),
      expect.objectContaining({
        id: dish_02.id,
        quantity: 1,
      }),
      expect.objectContaining({
        id: dish_03.id,
        quantity: 1,
      }),
      expect.objectContaining({
        id: dish_04.id,
        quantity: 2,
      }),
      expect.objectContaining({
        id: dish_05.id,
        quantity: 1,
      }),
    ]);
    expect(metrics.clients).toEqual([
      expect.objectContaining({
        id: client_01.id,
        name: client_01.name,
        last_name: client_01.last_name,
        email: client_01.email,
        phone: client_01.phone,
      }),
      expect.objectContaining({
        id: client_02.id,
        name: client_02.name,
        last_name: client_02.last_name,
        email: client_02.email,
        phone: client_02.phone,
      }),
    ]);
  });


  it("should not be able to get order metrics from a non-existing menu", async () => {
    await expect(
      sut.execute({
        menu_id: "non-existing-menu-id",
      })
    ).rejects.toBeInstanceOf(MenuNotFoundError);
  })
});