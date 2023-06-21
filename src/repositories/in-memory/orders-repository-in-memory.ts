import { Order, Prisma } from "@prisma/client";

import { OrdersRepository } from "../interfaces/orders-repository";
import { randomUUID } from "node:crypto";

export class InMemoryOrdersRepository implements OrdersRepository {
  private orders: Order[] = [];

  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    const order = {
      id: data.id || randomUUID(),
      client_id: data.client_id,
      note: data.note || undefined,
      delivery: data.delivery || true,
      total: 0,
      created_at: new Date(),
    } as Order;

    this.orders.push(order);

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return null;
    return order;
  }

  async findByDelivery(delivery: boolean): Promise<Order[]> {
    const orders = this.orders.filter((order) => order.delivery === delivery);
    return orders;
  }

  async update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return null;

    const updatedOrder = {
      ...order,
      note: data.note || order.note,
      delivery: data.delivery || order.delivery,
    } as Order;

    this.orders = this.orders.map((order) => {
      if (order.id === id) return updatedOrder;
      return order;
    });

    return updatedOrder;
  }

  async delete(id: string): Promise<void | null> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return null;

    this.orders = this.orders.filter((order) => order.id !== id);
  }

  async addTotal(id: string, quantity: number): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return null;

    const updatedOrder = {
      ...order,
      total: order.total + quantity,
    } as Order;

    this.orders = this.orders.map((order) => {
      if (order.id === id) return updatedOrder;
      return order;
    });

    return updatedOrder;
  }

  async subtractTotal(id: string, quantity: number): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return null;

    const updatedOrder = {
      ...order,
      total: order.total - quantity,
    } as Order;

    this.orders = this.orders.map((order) => {
      if (order.id === id) return updatedOrder;
      return order;
    });

    return updatedOrder;
  }

  async changeDelivery(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return null;

    const updatedOrder = {
      ...order,
      delivery: !order.delivery,
    } as Order;

    this.orders = this.orders.map((order) => {
      if (order.id === id) return updatedOrder;
      return order;
    });

    return updatedOrder;
  }
}