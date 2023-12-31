import { Dish } from '@prisma/client';
import { DishNotFoundError } from "./errors/dish-not-found";
import { DishesRepository } from '@/repositories/interfaces/dishes-repository';
import { MenuNotFoundError } from './errors/menu-not-found';
import { MenusRepository } from "@/repositories/interfaces/menus-repository";

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
    private menusRepository: MenusRepository,
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
    await this.dishesRepository.delete(dish_id);

    return {
      dish,
    };
  }
}