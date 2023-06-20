import { beforeEach, describe, expect, it } from "vitest";

import { DishNotFoundError } from "./errors/dish-not-found";
import { DishType } from "@prisma/client";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { MenuNotFoundError } from "./errors/menu-not-found";
import { RemoveDishOfMenuUseCase } from "./remove-dish-of-menu";
import exp from "constants";

let dishesRepository: InMemoryDishesRepository;
let menusRepository: InMemoryMenusRepository;

let sut: RemoveDishOfMenuUseCase;

describe("Remove Dish Of Menu Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    menusRepository = new InMemoryMenusRepository();

    sut = new RemoveDishOfMenuUseCase(dishesRepository, menusRepository);
  });

  it("should be able to remove a dish from a menu", async () => {
    const menu = await menusRepository.create(
      {
        created_at: '2023-02-10'
      }
    );

    const dishCreated = await dishesRepository.create({
      title: "Example Dish",
      description: "Example Description",
      kind: "MEAT" as DishType,
    })

    await dishesRepository.addDishToMenu(dishCreated.id, menu.id);

    const { dish } = await sut.execute({
      menu_id: menu.id,
      dish_id: dishCreated.id,
    });

    const dishesInMenu = await dishesRepository.findByMenuId(menu.id);

    expect(dishesInMenu.length).toEqual(0);
    expect(dish.id).toEqual(dishCreated.id);

  });

  it("should not be able to remove a dish from a menu that does not exist", async () => {
    await expect(sut.execute({
      menu_id: "non-existing-menu",
      dish_id: "non-existing-dish",
    })).rejects.toBeInstanceOf(MenuNotFoundError);
  });

  it("should not be able to remove a dish that does not exist", async () => {
    const menu = await menusRepository.create(
      {
        created_at: '2023-02-10'
      }
    );

    await expect(sut.execute({
      menu_id: menu.id,
      dish_id: "non-existing-dish",
    })).rejects.toBeInstanceOf(DishNotFoundError);
  })
});

