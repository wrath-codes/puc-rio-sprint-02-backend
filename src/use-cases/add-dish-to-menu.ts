import { Dish, DishType } from "@prisma/client";

import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { MenuHasFiveItemsError } from "./errors/menu-has-five-items";
import { MenuNotFoundError } from "./errors/menu-not-found";
import { MenusRepository } from "@/repositories/interfaces/menus-repository";

interface AddDishToMenuRequest {
  menu_id: string;
  dish: {
    title: string;
    description: string;
    kind: string;
  }
}

interface AddDishToMenuResponse {
  dish: Dish;
}

export class AddDishToMenuUseCase {
  constructor(
    private dishesRepository: DishesRepository,
    private menusRepository: MenusRepository,
  ) {}

  async execute({ menu_id, dish }: AddDishToMenuRequest): Promise<AddDishToMenuResponse> {
    const menu = await this.menusRepository.findById(menu_id);

    if (!menu) {
      throw new MenuNotFoundError();
    }


    const dishesInMenu = await this.dishesRepository.findByMenuId(menu.id);

    if (dishesInMenu.length >= 5) {
      throw new MenuHasFiveItemsError();
    }

    const createdDish = await this.dishesRepository.create({
      title: dish.title,
      description: dish.description,
      kind: dish.kind as DishType,
      menu_id: menu.id,
    });

    await this.dishesRepository.addDishToMenu(createdDish.id, menu.id);

    return {
      dish: createdDish,
    };
  }
}