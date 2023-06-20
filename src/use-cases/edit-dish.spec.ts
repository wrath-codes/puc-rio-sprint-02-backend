import { beforeEach, describe, expect, it } from "vitest";

import { DishNotFoundError } from "./errors/dish-not-found";
import { EditDishUseCase } from "./edit-dish";
import { InMemoryDishesRepository } from "@/repositories/in-memory/dishes-repository-in-memory";

let dishesRepository: InMemoryDishesRepository;
let sut: EditDishUseCase;

describe("Edit Dish Use Case", () => {
  beforeEach(() => {
    dishesRepository = new InMemoryDishesRepository();
    sut = new EditDishUseCase(dishesRepository);
  });

  it("should be able to edit an existing dish", async () => {
    const dish = await dishesRepository.create({
      title: "Example Dish",
      description: "Example Description",
      kind: "MEAT",
    });

    const { dish: updatedDish } = await sut.execute({
      dish_id: dish.id,
      title: "New Example Dish",
      description: "New Example Description",
      kind: "VEGETARIAN",
    });

    expect(updatedDish.title).toEqual("New Example Dish");
    expect(updatedDish.description).toEqual("New Example Description");
    expect(updatedDish.kind).toEqual("VEGETARIAN");
  });

  it("should not be able to edit a dish that does not exist", async () => {
    await expect(sut.execute({
      dish_id: "non-existing-dish",
      title: "New Example Dish",
      description: "New Example Description",
      kind: "VEGETARIAN",
    })).rejects.toBeInstanceOf(DishNotFoundError);
  })
});