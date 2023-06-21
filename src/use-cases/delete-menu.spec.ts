import { beforeEach, describe, expect, it } from "vitest";

import { DeleteMenuUseCase } from "./delete-menu";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { MenuNotFoundError } from "./errors/menu-not-found";

let menusRepository: InMemoryMenusRepository;
let dishesRepository: InMemoryDishesRepository;

let sut: DeleteMenuUseCase;

describe("Delete Menu Use Case", () => {
  beforeEach(() => {
    menusRepository = new InMemoryMenusRepository();
    dishesRepository = new InMemoryDishesRepository();

    sut = new DeleteMenuUseCase(menusRepository, dishesRepository);
  })

  it("should be able to delete an existing menu", async () => {
    const newMenu = await menusRepository.create({
      created_at: new Date(),
    });

    await dishesRepository.create({
      title: "Dish 1",
      description: "Dish 1 description",
      kind: "MEAT",
      menu_id: newMenu.id,
    });

    await dishesRepository.create({
      title: "Dish 2",
      description: "Dish 2 description",
      kind: "VEGETARIAN",
      menu_id: newMenu.id,
    });


    await sut.execute({
      id: newMenu.id,
    });

    await expect(menusRepository.findById(newMenu.id)).resolves.toBeNull();
  })

  it("should delete all dishes of the menu", async () => {
    const newMenu = await menusRepository.create({
      created_at: new Date(),
    });

    await dishesRepository.create({
      title: "Dish 1",
      description: "Dish 1 description",
      kind: "MEAT",
      menu_id: newMenu.id,
    });

    await dishesRepository.create({
      title: "Dish 2",
      description: "Dish 2 description",
      kind: "VEGETARIAN",
      menu_id: newMenu.id,
    });

    await sut.execute({
      id: newMenu.id,
    });

    await expect(dishesRepository.findByMenuId(newMenu.id)).resolves.toHaveLength(0);
  })

  it("should not be able to delete a non-existing menu", async () => {
    await expect(sut.execute({
      id: "non-existing-menu-id",
    })).rejects.toBeInstanceOf(MenuNotFoundError);
  })
})