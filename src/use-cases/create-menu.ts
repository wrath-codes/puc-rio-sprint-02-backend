import { Menu } from "@prisma/client";
import { MenusRepository } from "@/repositories/interfaces/menus-repository";
import dayjs from "dayjs";

interface CreateMenuRequest {
  menu: {
    created_at?: string;
  };
}

interface CreateMenuResponse {
  menu: Menu;
}

export class CreateMenuUseCase {
  constructor(private menusRepository: MenusRepository) {}

  async execute({ menu }: CreateMenuRequest): Promise<CreateMenuResponse> {
    const createdMenu = await this.menusRepository.create({
      created_at: menu.created_at ? dayjs(menu.created_at).toDate() : dayjs().toDate(),
    });

    return {
      menu: createdMenu,
    };
  }
}