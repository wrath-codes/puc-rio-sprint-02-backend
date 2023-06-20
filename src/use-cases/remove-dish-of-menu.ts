import { Dish } from '@prisma/client';
import { DishNotFoundError } from "./errors/dish-not-found";
import { DishesRepository } from '@/repositories/interfaces/dishes-repository';
import { InMemoryMenusRepository } from "@/repositories/in-memory/menus-repository-in-memory";
import { MenuNotFoundError } from './errors/menu-not-found';

interface RemoveDishOfMenuRequest {
  menu_id: string;
  dish_id: string;
}

interface RemoveDishOfMenuResponse {
  dish: Dish;
}

export class RemoveDishOfMenuUseCase {
  constructor(
    private dishesRepository: DishesRepository,
    private menusRepository: InMemoryMenusRepository,
  ) {}

  async execute({ menu_id, dish_id }: RemoveDishOfMenuRequest): Promise<RemoveDishOfMenuResponse> {
    const menu = await this.menusRepository.findById(menu_id);

    if (!menu) {
      throw new MenuNotFoundError();
    }

    const dish = await this.dishesRepository.findById(dish_id);

    if (!dish) {
      throw new DishNotFoundError();
    }

    await this.dishesRepository.removeDishFromMenu(dish_id, menu_id);

    return {
      dish,
    };
  }
}