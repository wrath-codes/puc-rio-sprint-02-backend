import { Dish, DishType } from "@prisma/client";

import { DishNotFoundError } from "./errors/dish-not-found";
import { DishesRepository } from "@/repositories/interfaces/dishes-repository";

interface RemoveDishOfMenuRequest {
  dish_id: string;
  title?: string;
  description?: string;
  kind?: string
}

interface RemoveDishOfMenuResponse {
  dish: Dish;
}

export class EditDishUseCase {
  constructor(
    private dishesRepository: DishesRepository,
  ) {}

  async execute({ dish_id, title, description, kind }: RemoveDishOfMenuRequest): Promise<RemoveDishOfMenuResponse> {
    const dish = await this.dishesRepository.findById(dish_id);

    if (!dish) {
      throw new DishNotFoundError();
    }

    const dishKind = kind as DishType;

    const updatedDish = await this.dishesRepository.update(dish_id, { title, description, kind: dishKind });

    return {
      dish: updatedDish as Dish,
    };
  }
}