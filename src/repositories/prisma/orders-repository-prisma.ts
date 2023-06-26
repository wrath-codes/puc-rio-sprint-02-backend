import { Order, Prisma } from "@prisma/client";

import { OrdersRepository } from "../interfaces/orders-repository";
import { prisma } from "@/lib/prisma";

export class PrismaOrdersRepository implements OrdersRepository {
  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    const order = await prisma.order.create({
      data: {
        id: data.id,
        client_id: data.client_id,
        note: data.note,
        delivery: data.delivery,
        total: 0,
        created_at: new Date(),
      },
    });

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) return null;

    return order;
  }

  async findByClientId(client_id: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { client_id },
    });

    return orders;
  }

  async findByDelivery(delivery: boolean): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { delivery },
    });

    return orders;
  }

  async update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order | null> {
    const order = await prisma.order.update({
      where: { id },
      data: {
        note: data.note,
        delivery: data.delivery,
      },
    });

    if (!order) return null;

    return order;
  }

  async delete(id: string): Promise<void | null> {
    const order = await prisma.order.delete({
      where: { id },
    });

    if (!order) return null;
  }

  async addTotal(id: string, quantity: number): Promise<Order | null> {
    const order = await prisma.order.update({
      where: { id },
      data: {
        total: {
          increment: quantity,
        },
      },
    });

    if (!order) return null;

    return order;
  }

  async subtractTotal(id: string, quantity: number): Promise<Order | null> {
    const order = await prisma.order.update({
      where: { id },
      data: {
        total: {
          decrement: quantity,
        },
      },
    });

    if (!order) return null;

    return order;
  }

  async changeDelivery(id: string): Promise<Order | null> {
    const order = await prisma.order.findFirst({
      where: { id },
    });

    if (!order) return null;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        delivery: !order.delivery,
      },
    });

    return updatedOrder;
  }
}