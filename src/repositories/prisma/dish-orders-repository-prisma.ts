import { DishOrder, Prisma } from "@prisma/client";

import { DishOrdersRepository } from "../interfaces/dish-orders-repository";
import { prisma } from "@/lib/prisma";

export class PrismaDishOrdersRepository implements DishOrdersRepository {
  async create(data: Prisma.DishOrderUncheckedCreateInput): Promise<DishOrder> {
    const dishOrder = await prisma.dishOrder.create({
      data: {
        id: data.id,
        order_id: data.order_id,
        dish_id: data.dish_id,
        quantity: data.quantity || 1,
      },
    });

    return dishOrder;
  }

  async findById(id: string): Promise<DishOrder | null> {
    const dishOrder = await prisma.dishOrder.findUnique({
      where: { id },
    });

    if (!dishOrder) return null;

    return dishOrder;
  }

  async findByOrderId(order_id: string): Promise<DishOrder[]> {
    const dishOrders = await prisma.dishOrder.findMany({
      where: { order_id },
    });

    return dishOrders;
  }

  async findByDishId(dish_id: string): Promise<DishOrder[]> {
    const dishOrders = await prisma.dishOrder.findMany({
      where: { dish_id },
    });

    return dishOrders;
  }

  async findByOrderIdAndDishId(order_id: string, dish_id: string): Promise<DishOrder | null> {
    const dishOrder = await prisma.dishOrder.findFirst({
      where: { order_id, dish_id },
    });

    if (!dishOrder) return null;

    return dishOrder;
  }

  async update(id: string, quantity: number): Promise<DishOrder | null> {
    const dishOrder = await prisma.dishOrder.update({
      where: { id },
      data: { quantity },
    });

    if (!dishOrder) return null;

    return dishOrder;
  }

  async delete(id: string): Promise<void | null> {
    const dishOrder = await prisma.dishOrder.findFirst({
      where: { id },
    });

    if (!dishOrder) return null;

    await prisma.dishOrder.delete({
      where: { id },
    });
  }

  async deleteAllByOrderId(order_id: string): Promise<void | null> {
    const dishOrders = await prisma.dishOrder.findMany({
      where: { order_id },
    });

    if (!dishOrders) return null;

    await prisma.dishOrder.deleteMany({
      where: { order_id },
    });
  }
}