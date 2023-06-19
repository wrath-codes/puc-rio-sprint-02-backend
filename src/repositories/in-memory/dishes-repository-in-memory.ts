import { Dish, DishType, Prisma } from "@prisma/client";

import { DishesRepository } from "../interfaces/dishes-repository";
import { randomUUID } from "node:crypto";

export class InMemoryDishesRepository implements DishesRepository {
  private dishes: Dish[] = [];

  async create(data: Prisma.DishUncheckedCreateInput): Promise<Dish> {
    const dish = {
      id: data.id || randomUUID(),
      title: data.title,
      description: data.description,
      kind: data.kind as DishType,
      menu_id: data.menu_id,
    } as Dish;

    this.dishes.push(dish);

    return dish;
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = this.dishes.find((dish) => dish.id === id);
    if (!dish) return null;
    return dish;
  }

  async findByMenuId(menuId: string): Promise<Dish[]> {
    const dishes = this.dishes.filter((dish) => dish.menu_id === menuId);
    return dishes;
  }

  async update(id: string, data: Prisma.DishUncheckedUpdateInput): Promise<Dish | null> {
    const dish = this.dishes.find((dish) => dish.id === id);
    if (!dish) return null;

    const updatedDish = {
      ...dish,
      title: data.title || dish.title,
      description: data.description || dish.description,
      kind: data.kind as DishType || dish.kind,
    } as Dish;

    this.dishes = this.dishes.map((dish) => {
      if (dish.id === id) return updatedDish;
      return dish;
    });

    return updatedDish;
  }

  async delete(id: string): Promise<void | null> {
    const dish = this.dishes.find((dish) => dish.id === id);
    if (!dish) return null;

    this.dishes = this.dishes.filter((dish) => dish.id !== id);
  }

  async list(): Promise<Dish[]> {
    return this.dishes;
  }
}