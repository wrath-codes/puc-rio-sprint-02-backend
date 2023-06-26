import { Menu, Prisma } from "@prisma/client";

import { MenusRepository } from "../interfaces/menus-repository";
import { prisma } from "@/lib/prisma";

export class PrismaMenusRepository implements MenusRepository {
  async create(data: Prisma.MenuUncheckedCreateInput): Promise<Menu> {
    const menu = await prisma.menu.create({
      data: {
        created_at: data.created_at || new Date(),
      },
    });

    return menu;
  }

  async findById(id: string): Promise<Menu | null> {
    const menu = await prisma.menu.findFirst({
      where: {
        id,
      },
    });

    if (!menu) return null;

    return menu;
  }

  async delete(id: string): Promise<void | null> {
    const menu = await prisma.menu.delete({
      where: {
        id,
      },
    });

    if (!menu) return null;
  }

  async list(): Promise<Menu[]> {
    const menus = await prisma.menu.findMany();

    return menus;
  }
}