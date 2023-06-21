import { DishesRepository } from "@/repositories/interfaces/dishes-repository";
import { Menu } from '@prisma/client';
import { MenuNotFoundError } from './errors/menu-not-found';
import { MenusRepository } from "@/repositories/interfaces/menus-repository";

interface DeleteMenuRequest {
  id: string;
}

interface DeleteMenuResponse {
  menu: Menu;
}

export class DeleteMenuUseCase {
  constructor(
    private menusRepository: MenusRepository,
    private dishesRepository: DishesRepository,
  ) {}

  async execute({
    id,
  }: DeleteMenuRequest): Promise<DeleteMenuResponse> {
    const menuExists = await this.menusRepository.findById(id);

    if (!menuExists) {
      throw new MenuNotFoundError();
    }

    await this.dishesRepository.deleteAllOfMenu(id);
    await this.menusRepository.delete(id);

    return {
      menu: menuExists as Menu,
    };
  }
}