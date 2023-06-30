import { Menu } from "@prisma/client";
import { MenuNotFoundError } from "./errors/menu-not-found";
import { MenusRepository } from "@/repositories/interfaces/menus-repository";

interface GetLatestMenuResponse {
  menu: Menu;
}

export class GetLatestMenuUseCase {
  constructor(
    private menusRepository: MenusRepository,
  ) {}

  async execute(): Promise<GetLatestMenuResponse> {
    const menu = await this.menusRepository.findLatest();

    if (!menu) {
      throw new MenuNotFoundError();
    }

    return {
      menu,
    };
  }
}