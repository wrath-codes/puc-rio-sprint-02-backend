import { DishOrder, Prisma } from "@prisma/client";

export interface DishOrdersRepository {
  create(data: Prisma.DishOrderUncheckedCreateInput): Promise<DishOrder>;
  findById(id: string): Promise<DishOrder | null>;
  findByOrderId(order_id: string): Promise<DishOrder[]>;
  findByDishId(dish_id: string): Promise<DishOrder[]>;
  update(id: string, quantity: number): Promise<DishOrder | null>;
  delete(id: string): Promise<void | null>;
}