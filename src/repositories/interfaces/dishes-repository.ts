import { Dish, Prisma } from '@prisma/client';

export interface DishesRepository {
  create(data: Prisma.DishUncheckedCreateInput): Promise<Dish>;
  findById(id: string): Promise<Dish | null>;
  findByMenuId(menuId: string): Promise<Dish[]>;
  update(id: string, data: Prisma.DishUncheckedUpdateInput): Promise<Dish | null>;
  delete(id: string): Promise<void | null>;
  deleteAllOfMenu(menuId: string): Promise<void | null>;
  list(): Promise<Dish[]>;
  addDishToMenu(dishId: string, menuId: string): Promise<void | null>;
  removeDishFromMenu(dishId: string, menuId: string): Promise<void | null>;
}