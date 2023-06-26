import { Dish, DishType, Prisma } from "@prisma/client";

import { DishesRepository } from "../interfaces/dishes-repository";
import { prisma } from "@/lib/prisma";

export class PrismaDishesRepository implements DishesRepository {
  async create(data: Prisma.DishUncheckedCreateInput): Promise<Dish> {
    const dish = await prisma.dish.create({
      data: {
        title: data.title,
        description: data.description,
        kind: data.kind as DishType,
        menu_id: data.menu_id ? data.menu_id : null,
      },
    });

    return dish;
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = await prisma.dish.findFirst({
      where: {
        id,
      },
    });

    if (!dish) return null;

    return dish;
  }

  async findByMenuId(menuId: string): Promise<Dish[]> {
    const dishes = await prisma.dish.findMany({
      where: {
        menu_id: menuId,
      },
    });

    return dishes;
  }

  async update(id: string, data: Prisma.DishUncheckedUpdateInput): Promise<Dish | null> {
    const dish = await prisma.dish.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        kind: data.kind as DishType,
      },
    });

    if (!dish) return null;

    return dish;
  }

  async delete(id: string): Promise<void | null> {
    const dish = await prisma.dish.delete({
      where: {
        id,
      },
    });

    if (!dish) return null;
  }

  async deleteAllOfMenu(menuId: string): Promise<void | null> {
    const dishes = await prisma.dish.deleteMany({
      where: {
        menu_id: menuId,
      },
    });

    if (!dishes) return null;
  }

  async list(): Promise<Dish[]> {
    const dishes = await prisma.dish.findMany();

    return dishes;
  }

  async addDishToMenu(dishId: string, menuId: string): Promise<void | null> {
    const dish = await prisma.dish.update({
      where: {
        id: dishId,
      },
      data: {
        menu_id: menuId,
      },
    });

    if (!dish) return null;
  }

  async removeDishFromMenu(dishId: string): Promise<void | null> {
    const dish = await prisma.dish.update({
      where: {
        id: dishId,
      },
      data: {
        menu_id: null,
      },
    });

    if (!dish) return null;
  }
}
