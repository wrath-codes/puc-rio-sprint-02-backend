import { beforeEach, describe, expect, it } from "vitest";

import { AddDishToMenuUseCase } from "./add-dish-to-menu";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { MenuHasFiveItemsError } from "./errors/menu-has-five-items";
import { MenuNotFoundError } from "./errors/menu-not-found";

let dishesRepository: InMemoryDishesRepository;
let menusRepository: InMemoryMenusRepository;
let sut: AddDishToMenuUseCase;

describe("Add Dish To Menu Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    menusRepository = new InMemoryMenusRepository();
    sut = new AddDishToMenuUseCase(dishesRepository, menusRepository);
  });

  it("should be able to add a dish to a menu", async () => {
    const menu = await menusRepository.create({
    });

    const { dish } = await sut.execute({
      menu_id: menu.id,
      dish: {
        title: "Example Dish",
        description: "Example Description",
        kind: "MEAT",
      },
    });

    expect(dish.id).toEqual(expect.any(String));
  });

  it("should not be able to add a dish to a menu that does not exist", async () => {
    await expect(sut.execute({
      menu_id: "non-existing-menu",
      dish: {
        title: "Example Dish",
        description: "Example Description",
        kind: "MEAT",
      },
    })).rejects.toBeInstanceOf(MenuNotFoundError);
  });

  it("should not be able to add a dish to a menu that already has five items", async () => {

    const menu = await menusRepository.create({
    });

    await sut.execute({
      menu_id: menu.id,
      dish: {
        title: "Example Dish 1",
        description: "Example Description 1",
        kind: "MEAT",
      },
    });

    await sut.execute({
      menu_id: menu.id,
      dish: {
        title: "Example Dish 2",
        description: "Example Description 2",
        kind: "CHICKEN",
      }
    });

    await sut.execute({
      menu_id: menu.id,
      dish: {
        title: "Example Dish 3",
        description: "Example Description 3",
        kind: "VETEGARIAN",
      }
    });

    await sut.execute({
      menu_id: menu.id,
      dish: {
        title: "Example Dish 4",
        description: "Example Description 4",
        kind: "MEAT",
      }
    });

    await sut.execute({
      menu_id: menu.id,
      dish: {
        title: "Example Dish 5",
        description: "Example Description 5",
        kind: "CHICKEN",
      }
    });

    const dishesInMenu = await dishesRepository.findByMenuId(menu.id);

    expect(dishesInMenu.length).toBe(5);
    await expect(sut.execute({
      menu_id: menu.id,
      dish: {
        title: "Example Dish 6",
        description: "Example Description 6",
        kind: "VETEGARIAN",
      }
    })).rejects.toBeInstanceOf(MenuHasFiveItemsError);

  });


});