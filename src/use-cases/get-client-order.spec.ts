import { beforeEach, describe, expect, it } from "vitest";

import { ClientNotFoundError } from "./errors/client-not-found";
import { DishOrdersRepositoryInMemory } from "@/repositories/in-memory/dish-orders-repository-in-memory";
import { GetClientOrder } from "./get-client-order";
import { InMemoryClientsRepository } from "@/repositories/in-memory/clients-repository-in-memory";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/orders-repository-in-memory";
import { MenuNotFoundError } from "./errors/menu-not-found";
import { OrderNotFoundError } from "./errors/order-not-found";

let clientsRepository: InMemoryClientsRepository;
let dishesRepository: InMemoryDishesRepository;
let dishOrdersRepository: DishOrdersRepositoryInMemory;
let ordersRepository: InMemoryOrdersRepository;
let menuRepository: InMemoryMenusRepository;
let sut: GetClientOrder;

describe("Get Client Order Use Case", () => {
  beforeEach(() => {
    clientsRepository = new InMemoryClientsRepository();
    dishesRepository = new InMemoryDishesRepository();
    dishOrdersRepository = new DishOrdersRepositoryInMemory();
    ordersRepository = new InMemoryOrdersRepository();
    menuRepository = new InMemoryMenusRepository();
    sut = new GetClientOrder(
      ordersRepository,
      dishesRepository,
      dishOrdersRepository,
      clientsRepository
    );
  });

  it("should be able to get a client order with dishes", async () => {
    const client = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "jonhdoe@example.com",
      phone: "21987654321",
    });

    const menu = await menuRepository.create({
    });

    const menu2 = await menuRepository.create({
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
      menu_id: menu2.id,
      title: "Dish 4",
      description: "Dish 4 description",
      kind: "CHICKEN",
    });

    const order = await ordersRepository.create({
      client_id: client.id,
      delivery: true,
      note: "Example notes",
      total: 0,
    });

    const order2 = await ordersRepository.create({
      client_id: client.id,
      delivery: true,
      note: "Example notes",
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

    await dishOrdersRepository.create({
      order_id: order.id,
      dish_id: dish_03.id,
      quantity: 3,
    });

    await ordersRepository.addTotal(order.id, 3);

    await dishOrdersRepository.create({
      order_id: order2.id,
      dish_id: dish_04.id,
      quantity: 3,
    });

    await ordersRepository.addTotal(order2.id, 3);

    const { order: orderResponse, dishes: dishesResponse } = await sut.execute({
      client_id: client.id,
      menu_id: menu.id,
    });

    expect(orderResponse.id).toEqual(order.id);
    expect(orderResponse.client_id).toEqual(client.id);
    expect(orderResponse.delivery).toEqual(true);
    expect(orderResponse.note).toEqual("Example notes");
    expect(orderResponse.total).toEqual(10);
    expect(dishesResponse).toEqual([
      expect.objectContaining({
        dish_id: dish_01.id,
        quantity: 5,
      }),
      expect.objectContaining({
        dish_id: dish_02.id,
        quantity: 2,
      }),
      expect.objectContaining({
        dish_id: dish_03.id,
        quantity: 3,
      }),
    ]);
  });

  it("should not be able to get a client order with dishes if client does not exists", async () => {
    await expect(
      sut.execute({
        client_id: "non-existing-client-id",
        menu_id: "non-existing-menu-id",
      })
    ).rejects.toBeInstanceOf(ClientNotFoundError);
  })

  it("should not be able to get a client order with dishes if menu does not exists", async () => {
    const client = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "jonhdoe@example.com",
      phone: "21987654321",
    });

    await expect(
      sut.execute({
        client_id: client.id,
        menu_id: "non-existing-menu-id",
      })
    ).rejects.toBeInstanceOf(MenuNotFoundError);
  })

  it("should not be able to get a client order with dishes if client hasn't an order from the menu", async () => {
    const client = await clientsRepository.create({
      name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "21987654321",
    });

    const menu = await menuRepository.create({
    });

    await dishesRepository.create({
      menu_id: menu.id,
      title: "Dish 1",
      description: "Dish 1 description",
      kind: "MEAT",
    });

    await expect(
      sut.execute({
        client_id: client.id,
        menu_id: menu.id,
      })
    ).rejects.toBeInstanceOf(OrderNotFoundError);
  })
});



