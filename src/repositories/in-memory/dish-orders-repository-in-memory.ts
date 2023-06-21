import { DishOrder, Prisma } from "@prisma/client";

import { DishOrdersRepository } from "../interfaces/dish-orders-repository";
import { randomUUID } from "node:crypto";

export class DishOrdersRepositoryInMemory implements DishOrdersRepository {
  private dishOrders: DishOrder[] = [];

  async create(data: Prisma.DishOrderUncheckedCreateInput): Promise<DishOrder> {
    const dishOrder = {
      id: data.id || randomUUID(),
      order_id: data.order_id,
      dish_id: data.dish_id,
      quantity: data.quantity || 1,
    } as DishOrder;

    this.dishOrders.push(dishOrder);

    return dishOrder;
  }

  async findById(id: string): Promise<DishOrder | null> {
    const orderDish = this.dishOrders.find(dishOrder => dishOrder.id === id);
    if (!orderDish) return null;
    return orderDish;
  }

  async findByOrderId(order_id: string): Promise<DishOrder[]> {
    const dishOrders = this.dishOrders.filter(dishOrder => dishOrder.order_id === order_id);
    return dishOrders;
  }

  async findByDishId(dish_id: string): Promise<DishOrder[]> {
    const dishOrders = this.dishOrders.filter(dishOrder => dishOrder.dish_id === dish_id);
    return dishOrders;
  }

  async findByOrderIdAndDishId(order_id: string, dish_id: string): Promise<DishOrder | null> {
    const dishOrder = this.dishOrders.find(dishOrder => dishOrder.order_id === order_id && dishOrder.dish_id === dish_id);
    if (!dishOrder) return null;
    return dishOrder;
  }

  async update(id: string, quantity: number): Promise<DishOrder | null> {
    const dishOrder = this.dishOrders.find(dishOrder => dishOrder.id === id);
    if (!dishOrder) return null;
    dishOrder.quantity = quantity;
    return dishOrder;
  }

  async delete(id: string): Promise<void | null> {
    const dishOrder = this.dishOrders.find(dishOrder => dishOrder.id === id);
    if (!dishOrder) return null;
    this.dishOrders = this.dishOrders.filter(dishOrder => dishOrder.id !== id);
  }
}