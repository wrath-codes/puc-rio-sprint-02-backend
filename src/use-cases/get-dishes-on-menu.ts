import { Dish, Menu } from "@prisma/client";

import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { MenuNotFoundError } from "./errors/menu-not-found";
import { MenusRepository } from "@/repositories/interfaces/menus-repository";

interface GetDishesOnMenuRequest {
  menu_id: string;
}

interface GetDishesOnMenuResponse {
  dishes: Dish[];
}

export class GetDishesOnMenuUseCase {
  constructor(
    private menusRepository: MenusRepository,
    private dishesRepository: DishesRepository,
  ) {}

  async execute({
    menu_id,
  }: GetDishesOnMenuRequest): Promise<GetDishesOnMenuResponse> {
    const menuExists = await this.menusRepository.findById(menu_id);

    if (!menuExists) {
      throw new MenuNotFoundError();
    }

    const dishes = await this.dishesRepository.findByMenuId(menu_id);

    return {
      dishes,
    };
  }
}