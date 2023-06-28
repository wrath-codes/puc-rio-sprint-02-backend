import { beforeEach, describe, expect, it } from "vitest";

import { GetDishesOnMenuUseCase } from "./get-dishes-on-menu";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { MenuNotFoundError } from "./errors/menu-not-found";

let dishesRepository: InMemoryDishesRepository;
let menuRepository: InMemoryMenusRepository;
let sut: GetDishesOnMenuUseCase;

describe("Get Dishes On Menu Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    menuRepository = new InMemoryMenusRepository();

    sut = new GetDishesOnMenuUseCase(menuRepository, dishesRepository);
  });

  it("should be able to get dishes from a menu", async () => {
    const menu = await menuRepository.create({});

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

    const response = await sut.execute({
      menu_id: menu.id,
    });

    expect(response.dishes).toEqual([dish_01, dish_02]);
  });

  it("should not be able to get dishes from a non-existing menu", async () => {
    await expect(
      sut.execute({
        menu_id: "non-existing-menu-id",
      })
    ).rejects.toBeInstanceOf(MenuNotFoundError);
  });
});